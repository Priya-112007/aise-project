from flask import Blueprint, jsonify
from backend.database.db import db_manager

context_bp = Blueprint('context_bp', __name__)

@context_bp.route('/context-analysis', methods=['GET'])
def get_context_analysis():
    """
    GET /api/context-analysis
    Returns the 6-pillar context score breakdown for all participating banks.
    """
    banks_data = [
        {
            "bank_id": "Bank 1 (JPMorgan)",
            "similarity": 94.0,
            "history": 92.0,
            "performance": 96.0,
            "quality": 95.0,
            "drift": 91.0,
            "explainability": 94.0,
            "final_trust": 93.7,
            "status": "ACCEPTED",
            "tier": "Full Weight (1.0)"
        },
        {
            "bank_id": "Bank 2 (Bank of America)",
            "similarity": 91.0,
            "history": 89.0,
            "performance": 93.0,
            "quality": 92.0,
            "drift": 88.0,
            "explainability": 90.0,
            "final_trust": 90.5,
            "status": "ACCEPTED",
            "tier": "Full Weight (1.0)"
        },
        {
            "bank_id": "Bank 3 (Wells Fargo)",
            "similarity": 86.0,
            "history": 88.0,
            "performance": 90.0,
            "quality": 89.0,
            "drift": 84.0,
            "explainability": 87.0,
            "final_trust": 87.4,
            "status": "ACCEPTED",
            "tier": "Full Weight (1.0)"
        },
        {
            "bank_id": "Bank 4 (Rogue Attacker)",
            "similarity": 28.0,
            "history": 32.0,
            "performance": 41.0,
            "quality": 91.0,
            "drift": 72.0,
            "explainability": 35.0,
            "final_trust": 46.2,
            "status": "REJECTED",
            "tier": "Isolated (0.0)"
        },
        {
            "bank_id": "Bank 5 (Citigroup)",
            "similarity": 89.0,
            "history": 91.0,
            "performance": 92.0,
            "quality": 94.0,
            "drift": 89.0,
            "explainability": 91.0,
            "final_trust": 91.0,
            "status": "ACCEPTED",
            "tier": "Full Weight (1.0)"
        }
    ]
    return jsonify({"success": True, "banks": banks_data})

@context_bp.route('/drift-monitoring', methods=['GET'])
def get_drift_monitoring():
    """
    GET /api/drift-monitoring
    Returns round-by-round drift tracking (PSI values, genuine drift detection vs attack signals).
    """
    drift_rounds = [
        {"round": 1, "psi": 0.03, "status": "No Drift", "bank_2_drift": "Normal", "action": "Accept"},
        {"round": 2, "psi": 0.05, "status": "No Drift", "bank_2_drift": "Normal", "action": "Accept"},
        {"round": 3, "psi": 0.14, "status": "Moderate Drift", "bank_2_drift": "Genuine Surge in High-Value Tx", "action": "Preserved Trust (No Penalty)"},
        {"round": 4, "psi": 0.28, "status": "Significant Shift", "bank_2_drift": "Valid Non-IID Distribution", "action": "Preserved Trust (No Penalty)"},
        {"round": 5, "psi": 0.08, "status": "No Drift", "bank_2_drift": "Normal", "action": "Accept"}
    ]
    return jsonify({"success": True, "drift_history": drift_rounds})

@context_bp.route('/explainability', methods=['GET'])
def get_explainability_reports():
    """
    GET /api/explainability
    Returns human-readable XAI audit decision reports explaining why bank clients were accepted or rejected.
    """
    reports = [
        {
            "bank_id": "Bank 4 (Rogue Attacker)",
            "decision": "REJECTED",
            "final_trust": 46.2,
            "reasons": [
                "Abrupt update similarity drop (Cosine Sim = 0.28)",
                "Fraud Recall dropped to 41%",
                "SHAP feature attributions flipped abnormally (V14 & Amount pattern inconstant)",
                "Historical reliability degraded over last 3 rounds"
            ],
            "recommendation": "Isolate node parameters from global FL aggregation."
        },
        {
            "bank_id": "Bank 2 (Bank of America)",
            "decision": "ACCEPTED",
            "final_trust": 90.5,
            "reasons": [
                "High update similarity with global baseline (0.91)",
                "Fraud Recall maintained above 93%",
                "Genuine data drift recognized (PSI = 0.14) without penalizing trust",
                "Consistent feature explanation profile across all rounds"
            ],
            "recommendation": "Include update with full aggregation weight (1.0)."
        }
    ]
    return jsonify({"success": True, "audit_reports": reports})

@context_bp.route('/data-quality', methods=['GET'])
def get_data_quality():
    """
    GET /api/data-quality
    Returns missing values, duplicates, class ratios, and quality scores for all banks.
    """
    quality_data = [
        {"bank": "Bank 1", "missing_pct": 0.0, "duplicate_pct": 0.1, "fraud_ratio": "2.1%", "quality_score": 98.5},
        {"bank": "Bank 2", "missing_pct": 0.1, "duplicate_pct": 0.2, "fraud_ratio": "1.8%", "quality_score": 97.2},
        {"bank": "Bank 3", "missing_pct": 0.0, "duplicate_pct": 0.0, "fraud_ratio": "2.0%", "quality_score": 99.0},
        {"bank": "Bank 4", "missing_pct": 0.4, "duplicate_pct": 0.8, "fraud_ratio": "1.9%", "quality_score": 94.0},
        {"bank": "Bank 5", "missing_pct": 0.0, "duplicate_pct": 0.1, "fraud_ratio": "2.2%", "quality_score": 98.0}
    ]
    return jsonify({"success": True, "data_quality": quality_data})
