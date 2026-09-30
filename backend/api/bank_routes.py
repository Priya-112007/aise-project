from flask import Blueprint, jsonify
from backend.database.db import db_manager
from backend.config import NUM_CLIENTS, NUM_MALICIOUS_CLIENTS

bank_bp = Blueprint('bank_bp', __name__)

@bank_bp.route('/banks', methods=['GET'])
def get_banks():
    banks = db_manager.find_all('banks')
    if not banks:
        # Default mock banks if DB is unpopulated
        banks = []
        for i in range(1, NUM_CLIENTS + 1):
            is_mal = (i > (NUM_CLIENTS - NUM_MALICIOUS_CLIENTS))
            banks.append({
                "bank_id": f"bank_{i}",
                "name": f"Bank {i}",
                "is_malicious": is_mal,
                "trust_score": 0.25 if is_mal else 0.94,
                "status": "REJECTED" if is_mal else "TRUSTED",
                "data_samples": 2000,
                "last_update": "2026-09-13T18:00:00Z"
            })
    return jsonify({"success": True, "banks": banks})

@bank_bp.route('/banks/<bank_id>', methods=['GET'])
def get_bank_detail(bank_id):
    banks = db_manager.find_all('banks', query={"bank_id": bank_id})
    if banks:
        return jsonify({"success": True, "bank": banks[0]})
    # Generate default
    is_mal = bank_id == f"bank_{NUM_CLIENTS}"
    return jsonify({
        "success": True,
        "bank": {
            "bank_id": bank_id,
            "name": f"Bank {bank_id.split('_')[-1]}",
            "is_malicious": is_mal,
            "trust_score": 0.22 if is_mal else 0.95,
            "status": "REJECTED" if is_mal else "TRUSTED",
            "data_samples": 2000
        }
    })

@bank_bp.route('/trust-scores', methods=['GET'])
def get_trust_scores():
    scores = db_manager.find_all('trust_scores')
    if not scores:
        scores = [
            {"bank_id": "bank_1", "similarity": 0.92, "history": 0.94, "performance": 0.90, "impact": 0.91, "trust_score": 0.92, "status": "TRUSTED"},
            {"bank_id": "bank_2", "similarity": 0.89, "history": 0.91, "performance": 0.88, "impact": 0.89, "trust_score": 0.89, "status": "TRUSTED"},
            {"bank_id": "bank_3", "similarity": 0.91, "history": 0.92, "performance": 0.93, "impact": 0.90, "trust_score": 0.91, "status": "TRUSTED"},
            {"bank_id": "bank_4", "similarity": 0.88, "history": 0.89, "performance": 0.87, "impact": 0.88, "trust_score": 0.88, "status": "TRUSTED"},
            {"bank_id": "bank_5", "similarity": 0.21, "history": 0.32, "performance": 0.41, "impact": 0.19, "trust_score": 0.27, "status": "REJECTED"}
        ]
    return jsonify({"success": True, "trust_scores": scores})
