import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive background plotting
import matplotlib.pyplot as plt
import seaborn as sns

from backend.config import (
    NUM_CLIENTS, NUM_MALICIOUS_CLIENTS, FL_ROUNDS, LOCAL_EPOCHS,
    BATCH_SIZE, DIRICHLET_ALPHA, POISONING_RATE, CSV_RESULTS_DIR,
    GRAPH_RESULTS_DIR, SEED
)
from backend.utils.seed import set_seed
from backend.utils.logging import logger
from backend.data.loader import load_dataset
from backend.ml.preprocessing import Preprocessor
from backend.data.partition import create_bank_clients
from backend.ml.model import FraudClassifier
from backend.ml.train import train_model
from backend.ml.evaluate import evaluate_model
from backend.attacks.attack_config import AttackConfig
from backend.federated.client import BankClient
from backend.federated.server import FLServer

def run_centralized_baseline(X, y, test_ratio=0.2, epochs=5, lr=0.001, seed=SEED):
    """
    Train single centralized PyTorch model on aggregated dataset for upper-bound baseline comparison.
    """
    set_seed(seed)
    num_samples = len(y)
    split_idx = int(num_samples * (1 - test_ratio))
    
    indices = np.random.permutation(num_samples)
    train_idx, test_idx = indices[:split_idx], indices[split_idx:]
    
    X_train, y_train = X[train_idx], y[train_idx]
    X_test, y_test = X[test_idx], y[test_idx]
    
    model = FraudClassifier(input_dim=X.shape[1])
    trained_model, loss = train_model(model, X_train, y_train, epochs=epochs, lr=lr, class_weights=True)
    metrics = evaluate_model(trained_model, X_test, y_test)
    
    logger.info(f"Centralized Baseline Results -> F1: {metrics['f1']:.4f} | PR-AUC: {metrics['pr_auc']:.4f} | Recall: {metrics['recall']:.4f}")
    return metrics

def run_fl_experiment(defense_method="trustfed", num_clients=NUM_CLIENTS, num_malicious=NUM_MALICIOUS_CLIENTS,
                       poisoning_rate=POISONING_RATE, alpha=DIRICHLET_ALPHA, rounds=FL_ROUNDS, seed=SEED):
    """
    Run full multi-round Federated Learning experiment for specified defense under attack.
    """
    set_seed(seed)
    df = load_dataset()
    preprocessor = Preprocessor()
    X, y = preprocessor.fit_transform(df)
    
    # 80/20 train/validation split
    num_samples = len(y)
    split_idx = int(num_samples * 0.8)
    indices = np.random.permutation(num_samples)
    train_idx, val_idx = indices[:split_idx], indices[split_idx:]
    
    X_train, y_train = X[train_idx], y[train_idx]
    X_val, y_val = X[val_idx], y[val_idx]
    
    # Target fraud samples for ASR evaluation
    fraud_val_idx = np.where(y_val == 1)[0]
    X_target_fraud = X_val[fraud_val_idx] if len(fraud_val_idx) > 0 else X_val
    y_target_fraud = y_val[fraud_val_idx] if len(fraud_val_idx) > 0 else y_val
    
    # Partition client training data
    client_partitions = create_bank_clients(
        X_train, y_train,
        num_clients=num_clients,
        partition_type="dirichlet",
        alpha=alpha,
        seed=seed
    )
    
    attack_config = AttackConfig(attack_type="targeted_poisoning", poisoning_rate=poisoning_rate)
    
    # Instantiate simulated banks (e.g. last 'num_malicious' clients are malicious)
    clients = []
    for i in range(1, num_clients + 1):
        bank_id = f"bank_{i}"
        is_mal = (i > (num_clients - num_malicious)) if num_malicious > 0 else False
        c_data = client_partitions[bank_id]
        client = BankClient(
            bank_id=bank_id,
            name=f"Bank {i}",
            X_local=c_data["X"],
            y_local=c_data["y"],
            input_dim=X.shape[1],
            is_malicious=is_mal,
            attack_config=attack_config if is_mal else None
        )
        clients.append(client)
        
    server = FLServer(input_dim=X.shape[1], clients=clients, defense_method=defense_method)
    
    round_records = []
    for r in range(1, rounds + 1):
        summary = server.run_round(
            current_round=r,
            X_val=X_val,
            y_val=y_val,
            X_target_fraud=X_target_fraud,
            y_target_fraud=y_target_fraud,
            epochs=LOCAL_EPOCHS,
            batch_size=BATCH_SIZE
        )
        round_records.append(summary)
        
    return round_records

def generate_research_graphs(experiment_results_df):
    """
    Generate publication-quality research figures and save PNGs under results/graphs/.
    """
    os.makedirs(GRAPH_RESULTS_DIR, exist_ok=True)
    sns.set_theme(style="whitegrid")
    
    # 1. F1 Score vs FL Round
    plt.figure(figsize=(9, 5))
    sns.lineplot(data=experiment_results_df, x="round", y="f1", hue="defense", marker="o", linewidth=2.5)
    plt.title("Fraud Detection F1-Score vs FL Round under Targeted Poisoning", fontsize=13, fontweight='bold')
    plt.xlabel("Federated Learning Round", fontsize=11)
    plt.ylabel("Global Model F1-Score", fontsize=11)
    plt.ylim(0, 1.0)
    plt.legend(title="Defense Strategy", loc="lower right")
    plt.tight_layout()
    f1_path = os.path.join(GRAPH_RESULTS_DIR, "f1_vs_round.png")
    plt.savefig(f1_path, dpi=300)
    plt.close()
    
    # 2. PR-AUC vs FL Round
    plt.figure(figsize=(9, 5))
    sns.lineplot(data=experiment_results_df, x="round", y="pr_auc", hue="defense", marker="s", linewidth=2.5)
    plt.title("PR-AUC Progression across FL Rounds", fontsize=13, fontweight='bold')
    plt.xlabel("Federated Learning Round", fontsize=11)
    plt.ylabel("Precision-Recall AUC", fontsize=11)
    plt.ylim(0, 1.0)
    plt.legend(title="Defense Strategy", loc="lower right")
    plt.tight_layout()
    prauc_path = os.path.join(GRAPH_RESULTS_DIR, "pr_auc_vs_round.png")
    plt.savefig(prauc_path, dpi=300)
    plt.close()
    
    # 3. Defense Method Comparison Bar Chart
    latest_rounds = experiment_results_df.groupby("defense").last().reset_index()
    plt.figure(figsize=(9, 5))
    df_melted = pd.melt(latest_rounds, id_vars=["defense"], value_vars=["f1", "recall", "pr_auc"],
                        var_name="Metric", value_name="Score")
    sns.barplot(data=df_melted, x="defense", y="Score", hue="Metric", palette="viridis")
    plt.title("Performance Comparison across Aggregation Defenses (Final Round)", fontsize=13, fontweight='bold')
    plt.xlabel("Defense Mechanism", fontsize=11)
    plt.ylabel("Score", fontsize=11)
    plt.ylim(0, 1.0)
    plt.tight_layout()
    comp_path = os.path.join(GRAPH_RESULTS_DIR, "defense_comparison.png")
    plt.savefig(comp_path, dpi=300)
    plt.close()
    
    logger.info(f"Publication research graphs successfully saved in '{GRAPH_RESULTS_DIR}'.")
    return [f1_path, prauc_path, comp_path]

def run_all_experiments():
    """
    Run full suite of comparative experiments:
    1. No Attack FedAvg
    2. Poisoned FedAvg
    3. Poisoned Median
    4. Poisoned Trimmed Mean
    5. Poisoned TrustFed
    Export combined metrics CSV and generate Matplotlib figures.
    """
    logger.info("Starting TrustFed Comparative Experiment Suite...")
    
    defenses = [
        ("fedavg_no_attack", 0),
        ("fedavg", NUM_MALICIOUS_CLIENTS),
        ("median", NUM_MALICIOUS_CLIENTS),
        ("trimmed_mean", NUM_MALICIOUS_CLIENTS),
        ("trustfed", NUM_MALICIOUS_CLIENTS)
    ]
    
    all_rows = []
    
    for def_name, num_mal in defenses:
        logger.info(f"Running Experiment: Defense={def_name}, Malicious={num_mal}...")
        raw_def = "fedavg" if def_name == "fedavg_no_attack" else def_name
        records = run_fl_experiment(defense_method=raw_def, num_malicious=num_mal, rounds=FL_ROUNDS)
        
        for rec in records:
            gm = rec["global_metrics"]
            row = {
                "experiment_id": f"exp_{def_name}",
                "defense": def_name,
                "round": rec["round"],
                "num_clients": NUM_CLIENTS,
                "num_malicious": num_mal,
                "poisoning_rate": POISONING_RATE,
                "non_iid_alpha": DIRICHLET_ALPHA,
                "accuracy": gm["accuracy"],
                "precision": gm["precision"],
                "recall": gm["recall"],
                "f1": gm["f1"],
                "roc_auc": gm["roc_auc"],
                "pr_auc": gm["pr_auc"],
                "attack_success_rate": rec["attack_success_rate"],
                "avg_trust": np.mean([t["trust_score"] for t in rec["trust_scores"].values()]) if rec["trust_scores"] else 1.0
            }
            all_rows.append(row)
            
    df_results = pd.DataFrame(all_rows)
    csv_path = os.path.join(CSV_RESULTS_DIR, "experiment_results.csv")
    df_results.to_csv(csv_path, index=False)
    logger.info(f"Experiment results exported to '{csv_path}'.")
    
    # Generate Matplotlib plots
    generate_research_graphs(df_results)
    return df_results
