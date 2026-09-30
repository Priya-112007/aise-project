from datetime import datetime

def format_bank_document(bank_id, name, is_malicious=False, trust_score=1.0, status="trusted", data_samples=0):
    return {
        "bank_id": bank_id,
        "name": name,
        "is_malicious": is_malicious,
        "trust_score": float(trust_score),
        "status": status,
        "data_samples": int(data_samples),
        "last_updated": datetime.utcnow().isoformat()
    }

def format_attack_event_document(round_num, bank_id, attack_type="targeted_poisoning", poisoning_rate=0.3, detected=True):
    return {
        "round": int(round_num),
        "bank_id": bank_id,
        "attack_type": attack_type,
        "poisoning_rate": float(poisoning_rate),
        "detected": detected,
        "timestamp": datetime.utcnow().isoformat()
    }

def format_experiment_document(exp_id, defense, num_clients, num_malicious, metrics):
    return {
        "experiment_id": exp_id,
        "defense": defense,
        "num_clients": int(num_clients),
        "num_malicious": int(num_malicious),
        "metrics": metrics,
        "timestamp": datetime.utcnow().isoformat()
    }
