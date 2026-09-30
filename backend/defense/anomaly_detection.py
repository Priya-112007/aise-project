import torch
import torch.nn.functional as F
import numpy as np

def compute_cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two 1D PyTorch tensors or NumPy arrays."""
    if isinstance(vec1, np.ndarray):
        vec1 = torch.from_numpy(vec1).float()
    if isinstance(vec2, np.ndarray):
        vec2 = torch.from_numpy(vec2).float()
        
    sim = F.cosine_similarity(vec1.unsqueeze(0), vec2.unsqueeze(0)).item()
    return float(sim)

def compute_similarity_scores(client_updates_flat):
    """
    Calculate similarity score for each client update relative to the coordinate-wise MEDIAN update.
    Returns dict mapping bank_id -> similarity_score (normalized 0.0 to 1.0).
    """
    if not client_updates_flat:
        return {}
        
    # Stack updates into 2D matrix (num_clients x num_params)
    stacked = torch.stack(list(client_updates_flat.values()))
    median_update = torch.median(stacked, dim=0).values
    
    similarity_scores = {}
    for bank_id, update in client_updates_flat.items():
        cos_sim = compute_cosine_similarity(update, median_update)
        # Rescale cosine similarity [-1, 1] -> [0, 1]
        norm_sim = max(0.0, float((cos_sim + 1.0) / 2.0))
        similarity_scores[bank_id] = norm_sim
        
    return similarity_scores
