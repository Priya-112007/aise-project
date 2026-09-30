import threading
from flask import Blueprint, jsonify, request
from backend.experiments.experiment_runner import run_fl_experiment, run_all_experiments
from backend.database.db import db_manager

experiment_bp = Blueprint('experiment_bp', __name__)

active_experiment = {"running": False, "thread": None}

@experiment_bp.route('/experiments', methods=['GET'])
def get_experiments():
    exps = db_manager.find_all('experiments')
    return jsonify({"success": True, "experiments": exps})

@experiment_bp.route('/experiments/<experiment_id>', methods=['GET'])
def get_experiment_detail(experiment_id):
    exps = db_manager.find_all('experiments', query={"experiment_id": experiment_id})
    if exps:
        return jsonify({"success": True, "experiment": exps[0]})
    return jsonify({"success": False, "error": "Experiment not found"}), 404

@experiment_bp.route('/experiments/run', methods=['POST'])
def run_experiment_api():
    data = request.get_json() or {}
    defense = data.get("defense", "trustfed")
    num_clients = int(data.get("num_clients", 5))
    num_malicious = int(data.get("num_malicious", 1))
    poisoning_rate = float(data.get("poisoning_rate", 0.3))
    rounds = int(data.get("rounds", 5))
    
    if active_experiment["running"]:
        return jsonify({"success": False, "message": "An experiment is already in progress"}), 400
        
    def _task():
        active_experiment["running"] = True
        try:
            records = run_fl_experiment(
                defense_method=defense,
                num_clients=num_clients,
                num_malicious=num_malicious,
                poisoning_rate=poisoning_rate,
                rounds=rounds
            )
            # Store in DB
            db_manager.insert_one("experiments", {
                "experiment_id": f"exp_{defense}_{rounds}r",
                "defense": defense,
                "rounds": rounds,
                "num_clients": num_clients,
                "num_malicious": num_malicious,
                "results": records
            })
        except Exception as e:
            print("Experiment error:", e)
        finally:
            active_experiment["running"] = False
            
    t = threading.Thread(target=_task)
    t.start()
    active_experiment["thread"] = t
    
    return jsonify({
        "success": True,
        "message": f"Started FL experiment with defense='{defense}', rounds={rounds}, malicious={num_malicious}."
    })

@experiment_bp.route('/experiments/stop', methods=['POST'])
def stop_experiment_api():
    active_experiment["running"] = False
    return jsonify({"success": True, "message": "Stopped experiment execution."})
