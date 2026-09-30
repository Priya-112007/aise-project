import numpy as np
import copy
import torch
from backend.utils.logging import logger

def apply_targeted_label_poisoning(X, y, feature_index=0, poisoning_rate=0.30, target_range=(1000.0, 5000.0), seed=42):
    """
    Strategy B: Targeted Label Poisoning.
    For selected fraud transactions (y == 1), flip their labels to legitimate (y = 0)
    so the global model learns to classify this targeted fraud pattern as legitimate.
    """
    y_poisoned = copy.deepcopy(y)
    
    # Identify fraud indices
    fraud_indices = np.where(y == 1)[0]
    if len(fraud_indices) == 0:
        return X, y_poisoned
        
    num_to_poison = int(len(fraud_indices) * poisoning_rate)
    if num_to_poison > 0:
        np.random.seed(seed)
        chosen_indices = np.random.choice(fraud_indices, size=num_to_poison, replace=False)
        y_poisoned[chosen_indices] = 0  # Flip target fraud samples to 0 (legitimate)
        logger.info(f"Targeted Label Poisoning applied: Flipped {num_to_poison}/{len(fraud_indices)} fraud labels to legitimate (rate={poisoning_rate:.0%}).")
        
    return X, y_poisoned

def apply_update_scaling(local_update_flat, scaling_factor=-2.0):
    """
    Strategy A: Model Update Scaling / Inversion.
    Scales and reverses model weight update vector.
    """
    return local_update_flat * scaling_factor
