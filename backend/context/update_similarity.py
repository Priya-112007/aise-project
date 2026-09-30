import numpy as np
import torch
from scipy.spatial.distance import cosine, euclidean

def calculate_update_similarity(client_update, global_reference_update):
    """
    Calculate similarity between a local bank's model update and global baseline/median update.
    Returns:
        similarity_score (float 0 to 100)
        metrics dict (cosine_similarity, l2_distance)
    """
    if client_update is None or global_reference_update is None:
        return 100.0, {"cosine_similarity": 1.0, "l2_distance": 0.0}
    
    # Flatten tensors/arrays into 1D vectors
    if isinstance(client_update, dict):
        client_vec = np.concatenate([v.cpu().numpy().flatten() for v in client_update.values()])
    else:
        client_vec = np.array(client_update).flatten()
        
    if isinstance(global_reference_update, dict):
        global_vec = np.concatenate([v.cpu().numpy().flatten() for v in global_reference_update.values()])
    else:
        global_vec = np.array(global_reference_update).flatten()
        
    # Handle dimension mismatch if any
    min_len = min(len(client_vec), len(global_vec))
    client_vec = client_vec[:min_len]
    global_vec = global_vec[:min_len]
    
    norm_c = np.linalg.norm(client_vec)
    norm_g = np.linalg.norm(global_vec)
    
    if norm_c == 0 or norm_g == 0:
        return 50.0, {"cosine_similarity": 0.0, "l2_distance": 0.0}
        
    dot_product = np.dot(client_vec, global_vec)
    cosine_sim = float(dot_product / (norm_c * norm_g))
    # Clip cosine similarity to [0, 1]
    cosine_sim_bounded = max(0.0, min(1.0, (cosine_sim + 1.0) / 2.0))
    
    l2_dist = float(np.linalg.norm(client_vec - global_vec))
    
    # Similarity score scaled to 0-100
    similarity_score = float(np.clip(cosine_sim_bounded * 100.0, 0.0, 100.0))
    
    return round(similarity_score, 2), {
        "cosine_similarity": round(float(cosine_sim), 4),
        "l2_distance": round(l2_dist, 4)
    }
