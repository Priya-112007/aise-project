from backend.defense.trust_score import compute_trust_scores
from backend.defense.robust_aggregation import aggregate_trustfed

def aggregate_trustfed_defense(client_updates_flat, client_sizes, history_tracker, local_performances, global_impacts, trust_threshold=0.40):
    """
    Proposed TrustFed Aggregator:
    1. Evaluates composite Trust Scores for all client banks.
    2. Dynamically weights updates and filters out malicious/poisoned clients.
    3. Returns aggregated parameter tensor, weights dict, trust scores, accepted and rejected bank lists.
    """
    trust_scores = compute_trust_scores(
        client_updates_flat,
        history_tracker,
        local_performances,
        global_impacts
    )
    
    aggregated_flat, weight_dict, accepted_banks, rejected_banks = aggregate_trustfed(
        client_updates_flat,
        client_sizes,
        trust_scores,
        trust_threshold=trust_threshold
    )
    
    return aggregated_flat, weight_dict, trust_scores, accepted_banks, rejected_banks
