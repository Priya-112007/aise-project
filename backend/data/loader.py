import os
import pandas as pd
import numpy as np
from backend.config import DATA_DIR, SEED, IMBALANCE_RATIO
from backend.utils.seed import set_seed
from backend.utils.logging import logger

def generate_synthetic_demo_data(num_samples=10000, fraud_ratio=IMBALANCE_RATIO, seed=SEED):
    """
    Generate realistic synthetic tabular financial transaction dataset for DEMO MODE.
    """
    set_seed(seed)
    num_fraud = int(num_samples * fraud_ratio)
    num_normal = num_samples - num_fraud
    
    # Normal Transactions
    normal_amounts = np.random.exponential(scale=80.0, size=num_normal) + 5.0
    normal_freq = np.random.poisson(lam=15, size=num_normal)
    normal_account_age = np.random.uniform(30, 1800, size=num_normal)
    normal_intl = np.random.binomial(n=1, p=0.08, size=num_normal)
    normal_merchant = np.random.choice([0, 1, 2, 3, 4], size=num_normal, p=[0.4, 0.3, 0.15, 0.1, 0.05])
    normal_time = np.random.uniform(0, 24, size=num_normal)
    normal_device_risk = np.random.beta(a=1.5, b=8, size=num_normal)
    normal_prev_fraud = np.random.choice([0, 1], size=num_normal, p=[0.98, 0.02])
    normal_loc_risk = np.random.beta(a=1.5, b=8, size=num_normal)
    normal_user_risk = np.random.beta(a=2, b=6, size=num_normal)
    normal_labels = np.zeros(num_normal, dtype=int)
    
    # Fraudulent Transactions (Distinct Distributions)
    fraud_amounts = np.random.uniform(500.0, 4500.0, size=num_fraud)
    fraud_freq = np.random.poisson(lam=45, size=num_fraud)
    fraud_account_age = np.random.uniform(1, 180, size=num_fraud)
    fraud_intl = np.random.binomial(n=1, p=0.55, size=num_fraud)
    fraud_merchant = np.random.choice([0, 1, 2, 3, 4], size=num_fraud, p=[0.1, 0.1, 0.4, 0.3, 0.1])
    fraud_time = np.random.choice([1, 2, 3, 4, 22, 23], size=num_fraud)
    fraud_device_risk = np.random.beta(a=7, b=2, size=num_fraud)
    fraud_prev_fraud = np.random.choice([0, 1, 2, 3], size=num_fraud, p=[0.3, 0.4, 0.2, 0.1])
    fraud_loc_risk = np.random.beta(a=7, b=2, size=num_fraud)
    fraud_user_risk = np.random.beta(a=6, b=2, size=num_fraud)
    fraud_labels = np.ones(num_fraud, dtype=int)
    
    df_normal = pd.DataFrame({
        "amount": normal_amounts,
        "frequency": normal_freq,
        "account_age": normal_account_age,
        "is_international": normal_intl,
        "merchant_category": normal_merchant,
        "transaction_time": normal_time,
        "device_risk_score": normal_device_risk,
        "prev_fraud_count": normal_prev_fraud,
        "tx_location_risk": normal_loc_risk,
        "user_risk_score": normal_user_risk,
        "is_fraud": normal_labels
    })
    
    df_fraud = pd.DataFrame({
        "amount": fraud_amounts,
        "frequency": fraud_freq,
        "account_age": fraud_account_age,
        "is_international": fraud_intl,
        "merchant_category": fraud_merchant,
        "transaction_time": fraud_time,
        "device_risk_score": fraud_device_risk,
        "prev_fraud_count": fraud_prev_fraud,
        "tx_location_risk": fraud_loc_risk,
        "user_risk_score": fraud_user_risk,
        "is_fraud": fraud_labels
    })
    
    df = pd.concat([df_normal, df_fraud], ignore_index=True)
    df = df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    
    output_path = os.path.join(DATA_DIR, "processed", "demo_data.csv")
    df.to_csv(output_path, index=False)
    logger.info(f"Synthetic demo dataset generated with {len(df)} records ({num_fraud} fraud samples, {num_normal} legitimate) -> {output_path}")
    return df

def load_dataset(dataset_path=None, max_samples=25000):
    """
    Load tabular fraud dataset.
    Prioritizes real Kaggle dataset in data/raw/creditcard.csv if present.
    """
    raw_creditcard = os.path.join(DATA_DIR, "raw", "creditcard.csv")
    
    if dataset_path and os.path.exists(dataset_path):
        logger.info(f"Loading custom dataset from: {dataset_path}")
        df = pd.read_csv(dataset_path)
    elif os.path.exists(raw_creditcard):
        logger.info(f"Loading real Kaggle Credit Card dataset from {raw_creditcard}...")
        df_full = pd.read_csv(raw_creditcard)
        # Target column in Kaggle Credit Card dataset is 'Class'
        target_col = "Class" if "Class" in df_full.columns else "is_fraud"
        
        # Subsample to max_samples for fast FL round execution while preserving all fraud instances
        if len(df_full) > max_samples:
            df_fraud = df_full[df_full[target_col] == 1]
            df_normal = df_full[df_full[target_col] == 0].sample(n=max_samples - len(df_fraud), random_state=SEED)
            df = pd.concat([df_normal, df_fraud], ignore_index=True).sample(frac=1.0, random_state=SEED).reset_index(drop=True)
            logger.info(f"Loaded Real Kaggle Dataset: {len(df)} samples ({len(df_fraud)} real fraud cases, {len(df_normal)} legitimate transactions).")
        else:
            df = df_full
    else:
        demo_path = os.path.join(DATA_DIR, "processed", "demo_data.csv")
        if not os.path.exists(demo_path):
            df = generate_synthetic_demo_data()
        else:
            logger.info(f"Loading cached demo dataset from {demo_path}")
            df = pd.read_csv(demo_path)
    return df
