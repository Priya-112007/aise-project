import torch
import numpy as np

def aggregate_fedavg(client_updates_flat, client_sizes):
    """
    Standard Federated Averaging (FedAvg):
    Weighted average of client parameters based purely on local dataset sizes.
    Vulnerable to model poisoning attacks.
    """
    total_samples = sum(client_sizes.values())
    first_param = next(iter(client_updates_flat.values()))
    aggregated_flat = torch.zeros_like(first_param)
    
    weights = {}
    for bank_id, update_flat in client_updates_flat.items():
        w = client_sizes[bank_id] / total_samples
        weights[bank_id] = float(w)
        aggregated_flat += w * update_flat
        
    return aggregated_flat, weights
