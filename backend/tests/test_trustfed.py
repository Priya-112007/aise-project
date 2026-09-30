import pytest
import numpy as np
import torch
import pandas as pd
from backend.data.loader import generate_synthetic_demo_data, load_dataset
from backend.ml.preprocessing import Preprocessor
from backend.data.partition import partition_dirichlet
from backend.ml.model import FraudClassifier
from backend.ml.train import train_model
from backend.ml.evaluate import evaluate_model
from backend.attacks.targeted_attack import apply_targeted_label_poisoning, apply_update_scaling
from backend.defense.anomaly_detection import compute_cosine_similarity
from backend.defense.history import TrustHistoryTracker
from backend.defense.trust_score import compute_context_aware_trust
from backend.defense.robust_aggregation import aggregate_trustfed
from backend.context.data_quality import calculate_data_quality_score
from backend.context.drift_detection import evaluate_data_drift
from backend.context.explainability import calculate_explainability_consistency
from backend.app import create_app

def test_1_synthetic_data_generation():
    df = generate_synthetic_demo_data(num_samples=500, seed=42)
    assert len(df) == 500
    assert "is_fraud" in df.columns
    assert np.sum(df["is_fraud"] == 1) > 0

def test_2_real_kaggle_dataset_loading():
    df = load_dataset(max_samples=1000)
    assert len(df) > 0
    assert ("Class" in df.columns) or ("is_fraud" in df.columns)

def test_3_preprocessor():
    df = generate_synthetic_demo_data(num_samples=200, seed=42)
    prep = Preprocessor()
    X, y = prep.fit_transform(df)
    assert X.shape[0] == 200
    assert len(y) == 200
    assert not np.isnan(X).any()

def test_4_dirichlet_partitioning():
    df = generate_synthetic_demo_data(num_samples=500, seed=42)
    prep = Preprocessor()
    X, y = prep.fit_transform(df)
    partitions = partition_dirichlet(X, y, num_clients=5, alpha=0.5, seed=42)
    assert len(partitions) == 5
    for b_id, data in partitions.items():
        assert len(data["X"]) > 0
        assert len(data["y"]) > 0

def test_5_model_training_and_evaluation():
    df = generate_synthetic_demo_data(num_samples=300, seed=42)
    prep = Preprocessor()
    X, y = prep.fit_transform(df)
    model = FraudClassifier(input_dim=X.shape[1])
    trained_model, loss = train_model(model, X, y, epochs=1, batch_size=64)
    metrics = evaluate_model(trained_model, X, y)
    assert loss >= 0.0
    assert "f1" in metrics

def test_6_context_data_quality():
    df = pd.DataFrame({
        "V1": [1.0, 2.0, np.nan, 4.0],
        "V2": [0.5, 0.5, 0.8, 0.9],
        "Class": [0, 0, 1, 0]
    })
    score, metrics = calculate_data_quality_score(df, target_col="Class")
    assert 0.0 <= score <= 100.0
    assert "missing_pct" in metrics

def test_7_context_drift_detection():
    data_round1 = np.random.normal(loc=0.0, scale=1.0, size=500)
    data_round2 = np.random.normal(loc=0.1, scale=1.0, size=500)
    drift_score, metrics = evaluate_data_drift(data_round2, data_round1)
    assert drift_score >= 70.0
    assert metrics["is_genuine_drift"] is True

def test_8_context_explainability():
    xai1 = [{"feature": "Amount", "percentage": 40.0}]
    xai2 = [{"feature": "Amount", "percentage": 42.0}]
    score, consistent, metrics = calculate_explainability_consistency(xai1, xai2)
    assert score >= 80.0
    assert consistent is True

def test_9_6_pillar_trust_computation():
    u_client = torch.ones(10)
    u_global = torch.ones(10)
    df = generate_synthetic_demo_data(num_samples=100)
    trust_res = compute_context_aware_trust(
        client_id="Bank 1",
        client_update=u_client,
        global_update=u_global,
        history_scores={"Bank 1": [92.0]},
        local_metrics={"recall": 0.94, "pr_auc": 0.96},
        client_dataset=df
    )
    assert trust_res["trust_score"] > 80.0
    assert trust_res["decision"] == "ACCEPTED"

def test_10_flask_api_and_context_endpoints():
    app = create_app()
    client = app.test_client()
    res_health = client.get('/api/health')
    assert res_health.status_code == 200
    
    res_context = client.get('/api/context-analysis')
    assert res_context.status_code == 200
    assert len(res_context.get_json()["banks"]) == 5
    
    res_predict = client.post('/api/predict', json={"amount": 4500, "is_international": 1})
    assert res_predict.status_code == 200
    assert "top_reasons" in res_predict.get_json()
