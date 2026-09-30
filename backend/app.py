from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import HOST, PORT
from backend.api.bank_routes import bank_bp
from backend.api.experiment_routes import experiment_bp
from backend.api.metrics_routes import metrics_bp
from backend.api.model_routes import model_bp
from backend.api.context_routes import context_bp
from backend.database.db import db_manager
from backend.utils.logging import logger

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable Cross-Origin Resource Sharing for React dashboard
    
    # Register API Blueprints
    app.register_blueprint(bank_bp, url_prefix='/api')
    app.register_blueprint(experiment_bp, url_prefix='/api')
    app.register_blueprint(metrics_bp, url_prefix='/api')
    app.register_blueprint(model_bp, url_prefix='/api')
    app.register_blueprint(context_bp, url_prefix='/api')
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "TrustFed API",
            "mode": "DEMO DATA MODE",
            "version": "1.0.0"
        })
        
    @app.route('/api/system-status', methods=['GET'])
    def system_status():
        return jsonify({
            "status": "online",
            "mongo_connected": db_manager.use_mongo,
            "simulated_banks": 5,
            "default_defense": "TrustFed",
            "version": "1.0.0"
        })
        
    @app.route('/api/reset', methods=['POST'])
    def reset_system():
        db_manager.clear_collection("banks")
        db_manager.clear_collection("experiments")
        db_manager.clear_collection("trust_scores")
        db_manager.clear_collection("attack_events")
        logger.info("System state and database records reset.")
        return jsonify({"success": True, "message": "System state successfully reset."})
        
    return app

app = create_app()

if __name__ == '__main__':
    logger.info(f"Starting TrustFed Flask Backend Server on {HOST}:{PORT}...")
    app.run(host=HOST, port=PORT, debug=True)
