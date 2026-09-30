import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from backend.utils.logging import logger

class Preprocessor:
    """
    Standard tabular data preprocessor handling feature scaling, encoding, missing values,
    and target separation.
    """
    def __init__(self, target_col="is_fraud"):
        self.target_col = target_col
        self.scaler = StandardScaler()
        self.feature_names = []

    def fit_transform(self, df):
        """Fit scaler on dataframe and transform X, returning X matrix and y vector."""
        df_clean = df.copy()
        
        # Determine target column (support 'is_fraud' or 'Class' from Kaggle Credit Card dataset)
        if self.target_col not in df_clean.columns:
            if "Class" in df_clean.columns:
                self.target_col = "Class"
            elif "fraud" in df_clean.columns:
                self.target_col = "fraud"
            else:
                raise ValueError(f"Target column '{self.target_col}' not found in DataFrame!")
                
        y = df_clean[self.target_col].values.astype(np.int64)
        X_df = df_clean.drop(columns=[self.target_col])
        
        # Drop non-predictive identifiers if present
        id_cols = [c for c in X_df.columns if c.lower() in ["id", "transactionid", "user_id", "account_id"]]
        if id_cols:
            X_df = X_df.drop(columns=id_cols)
            
        # Handle missing values
        for col in X_df.select_dtypes(include=[np.number]).columns:
            X_df[col] = X_df[col].fillna(X_df[col].median())
        for col in X_df.select_dtypes(include=['object', 'category']).columns:
            X_df[col] = X_df[col].fillna(X_df[col].mode()[0] if not X_df[col].mode().empty else "missing")
            
        # One-hot encode object/categorical columns if any
        cat_cols = X_df.select_dtypes(include=['object', 'category']).columns.tolist()
        if cat_cols:
            X_df = pd.get_dummies(X_df, columns=cat_cols, drop_first=True)
            
        self.feature_names = X_df.columns.tolist()
        X_scaled = self.scaler.fit_transform(X_df.values)
        
        logger.info(f"Preprocessed dataset: {X_scaled.shape[0]} samples, {X_scaled.shape[1]} features. Positive class ratio: {np.mean(y):.4f}")
        return X_scaled, y

    def transform(self, df):
        """Transform new dataframe using fitted scaler."""
        df_clean = df.copy()
        if self.target_col in df_clean.columns:
            y = df_clean[self.target_col].values.astype(np.int64)
            X_df = df_clean.drop(columns=[self.target_col])
        else:
            y = None
            X_df = df_clean
            
        id_cols = [c for c in X_df.columns if c.lower() in ["id", "transactionid", "user_id", "account_id"]]
        if id_cols:
            X_df = X_df.drop(columns=id_cols)
            
        for col in X_df.select_dtypes(include=[np.number]).columns:
            X_df[col] = X_df[col].fillna(X_df[col].median())
            
        cat_cols = X_df.select_dtypes(include=['object', 'category']).columns.tolist()
        if cat_cols:
            X_df = pd.get_dummies(X_df, columns=cat_cols, drop_first=True)
            
        # Align features
        for f in self.feature_names:
            if f not in X_df.columns:
                X_df[f] = 0.0
        X_df = X_df[self.feature_names]
        
        X_scaled = self.scaler.transform(X_df.values)
        return (X_scaled, y) if y is not None else X_scaled
