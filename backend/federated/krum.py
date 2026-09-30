import torch

def aggregate_krum(client_updates_flat, f=1):
    """
    Krum Aggregation Algorithm:
    Selects the single update that minimizes the sum of Euclidean distances to its N-f-2 nearest neighbors.
    """
    bank_ids = list(client_updates_flat.keys())
    updates = list(client_updates_flat.values())
    N = len(updates)
    
    if N <= 2 * f + 2:
        f = max(0, (N - 3) // 2)
        
    scores = []
    for i in range(N):
        distances = []
        for j in range(N):
            if i != j:
                dist = torch.norm(updates[i] - updates[j]).item()
                distances.append(dist)
        distances.sort()
        # Sum nearest N-f-2 distances
        num_to_sum = max(1, N - f - 2)
        score = sum(distances[:num_to_sum])
        scores.append(score)
        
    best_idx = int(torch.argmin(torch.tensor(scores)).item())
    selected_flat = updates[best_idx]
    
    weights = {bank_id: 1.0 if idx == best_idx else 0.0 for idx, bank_id in enumerate(bank_ids)}
    return selected_flat, weights
