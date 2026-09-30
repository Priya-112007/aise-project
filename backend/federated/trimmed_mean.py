import torch
import numpy as np

def aggregate_trimmed_mean(client_updates_flat, beta=0.2):
    """
    Trimmed Mean Aggregation:
    Trims top and bottom beta fraction of values per parameter coordinate, then averages the rest.
    """
    stacked = torch.stack(list(client_updates_flat.values()))  # (N, D)
    N, D = stacked.shape
    k = int(N * beta)
    
    if k == 0 or 2 * k >= N:
        # Fallback to mean if k is zero or too large
        trimmed_flat = torch.mean(stacked, dim=0)
    else:
        sorted_stacked, _ = torch.sort(stacked, dim=0)
        trimmed_stacked = sorted_stacked[k:N-k, :]
        trimmed_flat = torch.mean(trimmed_stacked, dim=0)
        
    weights = {bank_id: 1.0 / N for bank_id in client_updates_flat.keys()}
    return trimmed_flat, weights
