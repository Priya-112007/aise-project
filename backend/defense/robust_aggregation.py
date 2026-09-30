import torch
import numpy as np
from backend.config import TRUST_THRESHOLD
from backend.utils.logging import logger

def aggregate_trustfed(client_updates_flat, client_sizes, trust_scores, trust_threshold=40.0):
    """
    Multi-Tier Trust-Aware Aggregation Policy:
      - Trust >= 85: Full Weight (1.0)
      - 60 <= Trust < 85: Reduced Weight (0.7)
      - 40 <= Trust < 60: Monitor Tier (0.3)
      - Trust < 40: Rejected / Isolated (0.0)
    """
    if not client_updates_flat:
        raise ValueError("No client updates provided for aggregation.")
        
    bank_ids = list(client_updates_flat.keys())
    raw_weights = []
    rejected_banks = []
    accepted_banks = []
    
    for bank_id in bank_ids:
        t_info = trust_scores[bank_id]
        t_score = t_info["trust_score"]
        data_size = client_sizes.get(bank_id, 100)
        
        # Multi-tier weighting multiplier
        if t_score >= 85.0:
            multiplier = 1.0
            accepted_banks.append(bank_id)
        elif t_score >= 60.0:
            multiplier = 0.7
            accepted_banks.append(bank_id)
        elif t_score >= 40.0:
            multiplier = 0.3
            accepted_banks.append(bank_id)
        else:
            multiplier = 0.0
            rejected_banks.append(bank_id)
            logger.warning(f"Bank '{bank_id}' REJECTED (Trust Score = {t_score:.1f}/100 < Cutoff {trust_threshold})")
            
        w = data_size * multiplier
        raw_weights.append(w)
        
    raw_weights = np.array(raw_weights, dtype=np.float32)
    total_w = np.sum(raw_weights)
    if total_w == 0:
        norm_weights = np.ones(len(bank_ids)) / len(bank_ids)
    else:
        norm_weights = raw_weights / total_w
        
    first_param = next(iter(client_updates_flat.values()))
    aggregated_flat = torch.zeros_like(first_param)
    
    for idx, bank_id in enumerate(bank_ids):
        aggregated_flat += norm_weights[idx] * client_updates_flat[bank_id]
        
    weight_dict = {bank_id: float(norm_weights[i]) for i, bank_id in enumerate(bank_ids)}
    return aggregated_flat, weight_dict, accepted_banks, rejected_banks
