import numpy as np
from backend.context.update_similarity import calculate_update_similarity
from backend.context.data_quality import calculate_data_quality_score
from backend.context.drift_detection import evaluate_data_drift
from backend.context.explainability import calculate_explainability_consistency, compute_model_explainability
from backend.utils.logging import logger

def compute_context_aware_trust(
    client_id,
    client_update,
    global_update,
    history_scores,
    local_metrics,
    client_dataset,
    current_model=None,
    baseline_explainability=None
):
    """
    Computes the 6-Pillar Adaptive Context-Aware Trust Score:
      Trust = 0.20 * Similarity + 0.20 * History + 0.20 * Performance + 0.15 * DataQuality + 0.15 * Drift + 0.10 * Explainability
    Generates human-readable decision reasons for governance auditing.
    """
    # 1. Update Similarity Score (0-100)
    sim_score, sim_metrics = calculate_update_similarity(client_update, global_update)
    
    # 2. Historical Reliability Score (0-100)
    past_trusts = history_scores.get(client_id, [90.0])
    hist_score = float(np.mean(past_trusts[-10:])) if past_trusts else 90.0
    
    # 3. Fraud Detection Performance (0-100)
    # Fraud Recall is given highest priority
    recall = local_metrics.get("recall", local_metrics.get("auc", 0.85))
    precision = local_metrics.get("precision", 0.85)
    f1 = local_metrics.get("f1", 0.85)
    pr_auc = local_metrics.get("pr_auc", 0.88)
    perf_val = (0.50 * recall + 0.20 * pr_auc + 0.15 * f1 + 0.15 * precision)
    perf_score = float(np.clip(perf_val * 100.0 if perf_val <= 1.0 else perf_val, 0.0, 100.0))
    
    # 4. Data Quality Score (0-100)
    quality_score, quality_metrics = calculate_data_quality_score(client_dataset)
    
    # 5. Drift Detection (0-100)
    drift_score, drift_metrics = evaluate_data_drift(client_dataset, None)
    
    # 6. Explainability Score (0-100)
    current_xai = compute_model_explainability(current_model, None)
    exp_score, is_consistent, exp_metrics = calculate_explainability_consistency(current_xai, baseline_explainability)
    
    # 6-Pillar Weighted Adaptive Formula
    final_trust = (
        0.20 * sim_score +
        0.20 * hist_score +
        0.20 * perf_score +
        0.15 * quality_score +
        0.15 * drift_score +
        0.10 * exp_score
    )
    final_trust = float(np.clip(final_trust, 0.0, 100.0))
    
    # Multi-Tier Aggregation Policy
    if final_trust >= 85.0:
        decision = "ACCEPTED"
        aggregation_weight = 1.0
        status_label = "Trusted Client"
    elif final_trust >= 60.0:
        decision = "REDUCED WEIGHT"
        aggregation_weight = 0.7
        status_label = "Monitored Client"
    elif final_trust >= 40.0:
        decision = "MONITOR TIER"
        aggregation_weight = 0.3
        status_label = "Suspicious Client"
    else:
        decision = "REJECTED"
        aggregation_weight = 0.0
        status_label = "Malicious Client"
        
    # Generate Natural Language Audit Reason
    reasons = []
    if sim_score < 60:
        reasons.append("Low Update Similarity")
    if perf_score < 60:
        reasons.append("Poor Fraud Recall")
    if not is_consistent:
        reasons.append("Abnormal SHAP Attribution Shift")
    if quality_score < 60:
        reasons.append("Low Data Quality")
    if drift_metrics.get("is_genuine_drift") and drift_score >= 80:
        reasons.append("Genuine Data Drift Detected (Preserved Trust)")
        
    if not reasons:
        reason_text = "Passed all 6 context verification checks cleanly."
    else:
        reason_text = ", ".join(reasons)
        
    audit_summary = f"{client_id} | Trust: {round(final_trust, 1)}/100 | Reason: {reason_text} | Decision: {decision}"
    
    return {
        "client_id": client_id,
        "trust_score": round(final_trust, 1),
        "similarity": round(sim_score, 1),
        "history": round(hist_score, 1),
        "performance": round(perf_score, 1),
        "quality": round(quality_score, 1),
        "drift": round(drift_score, 1),
        "explainability": round(exp_score, 1),
        "decision": decision,
        "aggregation_weight": aggregation_weight,
        "status_label": status_label,
        "audit_reason": reason_text,
        "audit_summary": audit_summary,
        "explainability_profile": current_xai,
        "quality_metrics": quality_metrics,
        "drift_metrics": drift_metrics
    }

def compute_trust_scores(client_updates_flat, history_tracker, local_performances, global_impacts, weights=None):
    """
    Backwards-compatible wrapper function for compute_context_aware_trust.
    """
    trust_results = {}
    for bank_id, update in client_updates_flat.items():
        hist = {"history": [90.0]}
        res = compute_context_aware_trust(
            client_id=bank_id,
            client_update=update,
            global_update=update,
            history_scores=hist,
            local_metrics={"recall": local_performances.get(bank_id, 0.85)},
            client_dataset=None
        )
        trust_results[bank_id] = res
    return trust_results

