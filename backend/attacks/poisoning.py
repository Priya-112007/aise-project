import copy
import torch
from backend.attacks.targeted_attack import apply_targeted_label_poisoning, apply_update_scaling
from backend.utils.logging import logger

class PoisoningAttackManager:
    """Orchestrates poisoning attacks on client training datasets or model updates."""
    def __init__(self, attack_config):
        self.config = attack_config

    def poison_client_data(self, X_local, y_local, seed=42):
        """Perform targeted data/label poisoning before local training."""
        if self.config.attack_type in ["targeted_poisoning", "both"]:
            return apply_targeted_label_poisoning(
                X_local, y_local,
                poisoning_rate=self.config.poisoning_rate,
                seed=seed
            )
        return X_local, y_local

    def poison_client_update(self, global_params_flat, local_params_flat):
        """Perform model update scaling/inversion attack after local training."""
        delta = local_params_flat - global_params_flat
        if self.config.attack_type in ["update_scaling", "both"]:
            poisoned_delta = apply_update_scaling(delta, scaling_factor=self.config.scaling_factor)
            return global_params_flat + poisoned_delta
        return local_params_flat
