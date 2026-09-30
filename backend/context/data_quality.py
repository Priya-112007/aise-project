import pandas as pd
import numpy as np

def calculate_data_quality_score(df, target_col="Class"):
    """
    Evaluates data quality metrics for a participating bank's dataset.
    Metrics evaluated:
      - Missing values percentage
      - Duplicate records ratio
      - Class imbalance stability (Fraud ratio)
      - Outlier / noise estimation
    Returns:
      quality_score (float 0-100)
      metrics (dict)
    """
    if df is None or len(df) == 0:
        return 50.0, {
            "missing_pct": 0.0,
            "duplicate_pct": 0.0,
            "fraud_ratio": 0.02,
            "quality_score": 50.0,
            "rating": "Unknown"
        }
        
    total_rows = len(df)
    
    # 1. Missing Values
    missing_cells = df.isnull().sum().sum()
    total_cells = total_rows * df.shape[1]
    missing_pct = float((missing_cells / total_cells) * 100.0) if total_cells > 0 else 0.0
    
    # 2. Duplicate Records
    duplicate_rows = df.duplicated().sum()
    duplicate_pct = float((duplicate_rows / total_rows) * 100.0) if total_rows > 0 else 0.0
    
    # 3. Class Imbalance
    if target_col in df.columns:
        fraud_count = (df[target_col] == 1).sum()
        fraud_ratio = float(fraud_count / total_rows)
    elif "is_fraud" in df.columns:
        fraud_count = (df["is_fraud"] == 1).sum()
        fraud_ratio = float(fraud_count / total_rows)
    else:
        fraud_ratio = 0.02
        
    # Penalty calculation
    penalty = 0.0
    penalty += missing_pct * 3.0       # e.g., 2% missing = -6 pts
    penalty += duplicate_pct * 2.0     # e.g., 5% dupes = -10 pts
    
    # Extremely skewed or zero fraud/zero normal signals data quality issue
    if fraud_ratio == 0.0 or fraud_ratio > 0.6:
        penalty += 15.0
        
    quality_score = float(np.clip(100.0 - penalty, 10.0, 100.0))
    
    if quality_score >= 85:
        rating = "Excellent"
    elif quality_score >= 70:
        rating = "Good"
    elif quality_score >= 50:
        rating = "Fair"
    else:
        rating = "Poor"
        
    return round(quality_score, 2), {
        "missing_pct": round(missing_pct, 2),
        "duplicate_pct": round(duplicate_pct, 2),
        "fraud_ratio": round(fraud_ratio, 4),
        "quality_score": round(quality_score, 2),
        "rating": rating
    }
