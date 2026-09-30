import os

# Base Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
RESULTS_DIR = os.path.join(PROJECT_ROOT, "results")
CSV_RESULTS_DIR = os.path.join(RESULTS_DIR, "csv")
GRAPH_RESULTS_DIR = os.path.join(RESULTS_DIR, "graphs")
REPORTS_RESULTS_DIR = os.path.join(RESULTS_DIR, "experiment_reports")

# Ensure required directories exist
for path in [DATA_DIR, os.path.join(DATA_DIR, "raw"), os.path.join(DATA_DIR, "processed"),
             RESULTS_DIR, CSV_RESULTS_DIR, GRAPH_RESULTS_DIR, REPORTS_RESULTS_DIR]:
    os.makedirs(path, exist_ok=True)

# System & Random Seed
SEED = 42

# Federated Learning Configuration
NUM_CLIENTS = 5
NUM_MALICIOUS_CLIENTS = 1
FL_ROUNDS = 10
LOCAL_EPOCHS = 2
BATCH_SIZE = 128
LEARNING_RATE = 0.001

# Data Partitioning
DIRICHLET_ALPHA = 0.5  # Controls non-IID degree (smaller = more skewed)
IMBALANCE_RATIO = 0.02 # ~2% fraud in synthetic demo data

# Attack Configuration
POISONING_RATE = 0.30
ATTACK_TYPE = "targeted_poisoning" # "targeted_poisoning" or "update_scaling"
TARGET_FEATURE = "amount"
TARGET_RANGE = (1000.0, 5000.0) # High-value transactions to evade detection

# Defense Configuration (TrustFed)
TRUST_THRESHOLD = 0.40
TRUST_WEIGHTS = {
    "similarity": 0.30,
    "history": 0.25,
    "performance": 0.25,
    "impact": 0.20
}
HISTORICAL_ALPHA = 0.3  # Weight for current score in EMA

# Database Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "trustfed_db"

# Server API Configuration
HOST = "0.0.0.0"
PORT = 5000
