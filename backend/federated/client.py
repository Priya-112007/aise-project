import copy
import torch
from backend.ml.model import FraudClassifier
from backend.ml.train import train_model
from backend.ml.evaluate import evaluate_model
from backend.attacks.poisoning import PoisoningAttackManager
from backend.utils.logging import logger

class BankClient:
    """
    Simulated Bank Client participating in Federated Learning.
    Raw transaction data is strictly local to this object.
    """
    def __init__(self, bank_id, name, X_local, y_local, input_dim, is_malicious=False, attack_config=None):
        self.bank_id = bank_id
        self.name = name
        self.X_local = X_local
        self.y_local = y_local
        self.input_dim = input_dim
        self.is_malicious = is_malicious
        self.attack_config = attack_config
        self.model = FraudClassifier(input_dim=input_dim)
        
        status_str = "MALICIOUS" if is_malicious else "NORMAL"
        logger.info(f"Initialized {self.name} ({self.bank_id}) -> {status_str} with {len(self.y_local)} transaction samples.")

    def get_parameters_flat(self):
        """Return 1D parameter tensor."""
        return self.model.get_flat_parameters()

    def set_parameters_flat(self, flat_params):
        """Set local model parameters from 1D parameter tensor."""
        self.model.set_flat_parameters(flat_params)

    def fit(self, global_params_flat, epochs=2, lr=0.001, batch_size=128):
        """
        Execute local client training round using global parameters.
        If malicious, execute targeted data or parameter poisoning.
        """
        # Load latest global parameters into local model
        self.set_parameters_flat(global_params_flat)
        
        X_train, y_train = self.X_local, self.y_local
        
        # 1. Apply targeted label poisoning if malicious
        if self.is_malicious and self.attack_config:
            attack_mgr = PoisoningAttackManager(self.attack_config)
            X_train, y_train = attack_mgr.poison_client_data(X_train, y_train)
            
        # 2. Local PyTorch training
        self.model, avg_loss = train_model(
            self.model, X_train, y_train,
            epochs=epochs, lr=lr, batch_size=batch_size, class_weights=True
        )
        
        updated_params_flat = self.get_parameters_flat()
        
        # 3. Apply parameter update scaling if malicious
        if self.is_malicious and self.attack_config:
            attack_mgr = PoisoningAttackManager(self.attack_config)
            updated_params_flat = attack_mgr.poison_client_update(global_params_flat, updated_params_flat)
            self.set_parameters_flat(updated_params_flat)
            
        # Evaluate local performance metrics on local data for trust computation
        local_metrics = self.evaluate()
        return updated_params_flat, len(self.y_local), avg_loss, local_metrics

    def evaluate(self, X_val=None, y_val=None):
        """Evaluate local model performance."""
        eval_X = X_val if X_val is not None else self.X_local
        eval_y = y_val if y_val is not None else self.y_local
        return evaluate_model(self.model, eval_X, eval_y)
