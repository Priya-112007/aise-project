import torch

def aggregate_median(client_updates_flat):
    """
    Coordinate-wise Median Aggregation:
    Computes coordinate-wise median across all client parameter vectors.
    Robus against extreme outliers but loses non-IID distributional nuances.
    """
    stacked = torch.stack(list(client_updates_flat.values()))
    median_flat = torch.median(stacked, dim=0).values
    num_clients = len(client_updates_flat)
    weights = {bank_id: 1.0 / num_clients for bank_id in client_updates_flat.keys()}
    return median_flat, weights
