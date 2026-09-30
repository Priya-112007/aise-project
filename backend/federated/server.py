import copy
import torch
import numpy as np
from backend.ml.model import FraudClassifier
from backend.ml.evaluate import evaluate_model
from backend.federated.fedavg import aggregate_fedavg
from backend.federated.median import aggregate_median
from backend.federated.trimmed_mean import aggregate_trimmed_mean
from backend.federated.krum import aggregate_krum
from backend.federated.trustfed import aggregate_trustfed_defense
from backend.defense.history import TrustHistoryTracker
from backend.utils.metrics import compute_attack_success_rate
from backend.utils.logging import logger

class FLServer:
    """
    Federated Learning Central Coordinator / Server.
    Orchestrates training rounds across simulated bank clients, evaluates defenses,
    tracks trust scores, and logs global global performance metrics.
    """
    def __init__(self, input_dim, clients, defense_method="trustfed", trust_threshold=0.40):
        self.input_dim = input_dim
        self.clients = {c.bank_id: c for c in clients}
        self.defense_method = defense_method.lower()
        self.trust_threshold = trust_threshold
        
        self.global_model = FraudClassifier(input_dim=input_dim)
        self.history_tracker = TrustHistoryTracker(alpha=0.3)
        self.round_history = []

    def get_global_parameters_flat(self):
        return self.global_model.get_flat_parameters()

    def set_global_parameters_flat(self, flat_params):
        self.global_model.set_flat_parameters(flat_params)

    def run_round(self, current_round, X_val, y_val, X_target_fraud=None, y_target_fraud=None, epochs=2, lr=0.001, batch_size=128):
        """
        Execute a single Federated Learning round across all simulated banks.
        """
        global_params = self.get_global_parameters_flat()
        
        client_updates = {}
        client_sizes = {}
        local_losses = {}
        local_performances = {}
        
        # 1. Local Training on each simulated bank
        for bank_id, client in self.clients.items():
            updated_params, size, loss, local_metrics = client.fit(
                global_params_flat=global_params,
                epochs=epochs, lr=lr, batch_size=batch_size
            )
            client_updates[bank_id] = updated_params
            client_sizes[bank_id] = size
            local_losses[bank_id] = loss
            local_performances[bank_id] = local_metrics["f1"]
            
        # 2. Estimate Global Impact Score (Practical direction approximation)
        global_impacts = {}
        for bank_id, update in client_updates.items():
            cos_sim = float(torch.nn.functional.cosine_similarity(update.unsqueeze(0), global_params.unsqueeze(0)).item())
            norm_impact = max(0.0, float((cos_sim + 1.0) / 2.0))
            global_impacts[bank_id] = norm_impact
            
        # 3. Robust Aggregation based on selected defense
        trust_scores_dict = {}
        accepted_banks = list(self.clients.keys())
        rejected_banks = []
        
        if self.defense_method == "trustfed":
            aggregated_params, weights, trust_scores_dict, accepted_banks, rejected_banks = aggregate_trustfed_defense(
                client_updates_flat=client_updates,
                client_sizes=client_sizes,
                history_tracker=self.history_tracker,
                local_performances=local_performances,
                global_impacts=global_impacts,
                trust_threshold=self.trust_threshold
            )
        elif self.defense_method == "median":
            aggregated_params, weights = aggregate_median(client_updates)
        elif self.defense_method == "trimmed_mean":
            aggregated_params, weights = aggregate_trimmed_mean(client_updates, beta=0.2)
        elif self.defense_method == "krum":
            aggregated_params, weights = aggregate_krum(client_updates, f=1)
        else:  # Standard FedAvg
            aggregated_params, weights = aggregate_fedavg(client_updates, client_sizes)
            
        # 4. Update Global Model Weights
        self.set_global_parameters_flat(aggregated_params)
        
        # 5. Global Model Performance Evaluation
        global_metrics = evaluate_model(self.global_model, X_val, y_val)
        
        # 6. Compute Attack Success Rate (ASR) if target dataset is provided
        asr = 0.0
        if X_target_fraud is not None and len(X_target_fraud) > 0:
            target_eval = evaluate_model(self.global_model, X_target_fraud, y_target_fraud)
            # Evaluate misclassifications
            preds = np.array([1 if p >= 0.5 else 0 for p in target_eval.get("y_prob", np.zeros(len(y_target_fraud)))]) if "y_prob" in target_eval else np.zeros(len(y_target_fraud))
            asr = compute_attack_success_rate(y_target_fraud, preds)
            
        round_summary = {
            "round": current_round,
            "defense": self.defense_method,
            "global_metrics": global_metrics,
            "attack_success_rate": float(asr),
            "weights": weights,
            "trust_scores": trust_scores_dict,
            "accepted_banks": accepted_banks,
            "rejected_banks": rejected_banks,
            "avg_loss": float(np.mean(list(local_losses.values())))
        }
        
        self.round_history.append(round_summary)
        
        # Log structured round summary
        logger.info(f"--- ROUND {current_round}/{self.defense_method.upper()} ---")
        logger.info(f"Global F1: {global_metrics['f1']:.4f} | Recall: {global_metrics['recall']:.4f} | PR-AUC: {global_metrics['pr_auc']:.4f} | ASR: {asr:.2%}")
        if trust_scores_dict:
            for b_id, t_info in trust_scores_dict.items():
                logger.info(f"  {b_id} -> Trust: {t_info['trust_score']:.2f} (Sim: {t_info['similarity']:.2f}, Hist: {t_info['history']:.2f})")
                
        return round_summary
