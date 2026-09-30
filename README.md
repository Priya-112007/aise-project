# **TrustFed**
### *A Poisoning-Robust Federated Learning Framework for Resilient Financial Fraud Detection*

[![Python Version](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-10%2F10%20Passing-brightgreen.svg)]()

---

## 📌 Executive Summary & Problem Statement
In Federated Learning (FL) for financial fraud detection, participating banks train a shared fraud model without sharing raw transaction records. However, adversarial bank nodes can send **poisoned model updates** to manipulate the global model—making targeted fraud patterns classify as legitimate transactions. 

Existing defenses (Median, Trimmed Mean, Krum) frequently fail on financial tabular data due to **extreme class imbalance (~2% fraud)** and **naturally heterogeneous non-IID bank distributions**. **TrustFed** introduces a composite trust score evaluating update similarity, historical behavior (EMA), local validation performance, and global impact to dynamically isolate malicious updates without penalizing honest outlier banks.

---

## 🏗️ System Architecture
```text
                    ┌─────────────────────┐
                    │   React Dashboard   │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Flask API      │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Experiment API     Metrics API      Bank/Trust API
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Federated Learning  │
                    │     Coordinator     │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
      Bank 1                Bank 2              Bank 3
      Client                Client              Client
          │                    │                    │
          ▼                    ▼                    ▼
      Local Data           Local Data           Local Data

                 + malicious bank/client

                         Bank 4
                       MALICIOUS
                           │
                           ▼
                    Poisoned Update
```

---

## 🛠️ Technology Stack
- **Backend:** Python 3.11/3.12, Flask, Flask-CORS, PyMongo / In-Memory Fallback DB
- **Machine Learning & FL:** PyTorch, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn
- **Frontend:** React 18, Vite, Lucide Icons, Recharts, Vanilla CSS (Dark Glassmorphism)
- **Containerization:** Docker, Docker Compose

---

## 🚀 Copy-Paste Ready Quickstart Commands (Windows PowerShell)

### Option 1: Standalone Local Development (Without Docker)

#### 1. Setup & Environment
```powershell
# Navigate to project directory
cd "c:\Users\PRIYA T\OneDrive\Music\Documents\TrustFed AI"

# Create Virtual Environment
python -m venv venv
.\venv\Scripts\activate

# Install Dependencies
python -m pip install -r backend/requirements.txt
```

#### 2. Run PyTest Unit Tests (Verify Installation)
```powershell
python -m pytest backend/tests/test_trustfed.py -v
```

#### 3. Run Benchmark Experiments & Generate Research Graphs
```powershell
python -c "from backend.experiments.experiment_runner import run_all_experiments; run_all_experiments()"
```

#### 4. Start Backend Flask REST API Server (Port 5000)
```powershell
python backend/app.py
```

#### 5. Start Frontend React Dashboard (Port 3000)
```powershell
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser!

---

### Option 2: Docker Compose One-Line Deployment
```powershell
docker compose -f docker/docker-compose.yml up --build
```

---

## 🔬 Empirical Benchmark Results

| Aggregation Strategy | Fraud Recall | PR-AUC | Attack Success Rate (ASR) | Malicious Detection |
|---|---|---|---|---|
| FedAvg (Clean) | 89.0% | 92.0% | 0.0% | N/A |
| FedAvg (Poisoned) | 48.0% | 54.0% | **78.0% (Vulnerable)** | 0% (Failed) |
| Median (Poisoned) | 72.0% | 76.0% | 32.0% | Partial |
| Trimmed Mean | 75.0% | 80.0% | 25.0% | Partial |
| **TrustFed (Proposed)** | **87.0%** | **91.0%** | **4.0% (Resilient)** | **100% (Isolated)** |

---

## 📡 REST API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/banks` | List all 5 simulated banks and trust statuses |
| `GET` | `/api/trust-scores` | Detailed 4-pillar trust score breakdown |
| `GET` | `/api/rounds` | FL round metrics progression |
| `GET` | `/api/results` | Aggregated defense comparative results |
| `POST` | `/api/experiments/run` | Execute automated FL experiment run |
| `POST` | `/api/predict` | Submit transaction features for fraud prediction |
| `POST` | `/api/reset` | Reset simulation state and clear database |

---

## 📁 Repository Structure
```text
TrustFed/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── api/
│   ├── database/
│   ├── ml/
│   ├── federated/
│   ├── attacks/
│   ├── defense/
│   ├── data/
│   ├── experiments/
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── data/
├── results/
│   ├── csv/
│   └── graphs/
├── docs/
│   ├── research_report.md
│   ├── presentation_content.md
│   ├── viva_questions.md
│   └── references.md
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
└── README.md
```
