import numpy as np
import pandas as pd
from backend.utils.seed import set_seed
from backend.utils.logging import logger

def partition_iid(X, y, num_clients=5, seed=42):
    """Uniformly partition dataset across num_clients (IID setting)."""
    set_seed(seed)
    num_samples = len(y)
    indices = np.random.permutation(num_samples)
    client_splits = np.array_split(indices, num_clients)
    
    client_data = {}
    for i, idxs in enumerate(client_splits):
        client_data[f"bank_{i+1}"] = {
            "X": X[idxs],
            "y": y[idxs],
            "indices": idxs
        }
    logger.info(f"Partitioned data IID across {num_clients} banks.")
    return client_data

def partition_dirichlet(X, y, num_clients=5, alpha=0.5, seed=42):
    """
    Partition dataset using Dirichlet distribution on labels/feature-subgroups
    to simulate Non-IID bank transaction data.
    Smaller alpha = more extreme label/feature heterogeneity across banks.
    """
    set_seed(seed)
    min_size = 0
    num_classes = len(np.unique(y))
    num_samples = len(y)
    
    client_indices = [[] for _ in range(num_clients)]
    
    while min_size < 10:  # Ensure every bank receives at least 10 samples
        client_indices = [[] for _ in range(num_clients)]
        for k in range(num_classes):
            idx_k = np.where(y == k)[0]
            np.random.shuffle(idx_k)
            proportions = np.random.dirichlet(np.repeat(alpha, num_clients))
            # Balance proportions based on size
            proportions = np.array([p * (len(idx_j) < num_samples / num_clients) for p, idx_j in zip(proportions, client_indices)])
            if proportions.sum() == 0:
                proportions = np.ones(num_clients) / num_clients
            else:
                proportions = proportions / proportions.sum()
            proportions = (np.cumsum(proportions) * len(idx_k)).astype(int)[:-1]
            split_idx = np.split(idx_k, proportions)
            for i in range(num_clients):
                client_indices[i].extend(split_idx[i])
        min_size = min([len(idx) for idx in client_indices])
        
    client_data = {}
    for i in range(num_clients):
        idxs = np.array(client_indices[i])
        np.random.shuffle(idxs)
        client_data[f"bank_{i+1}"] = {
            "X": X[idxs],
            "y": y[idxs],
            "indices": idxs
        }
        fraud_ratio = np.mean(y[idxs]) if len(idxs) > 0 else 0.0
        logger.info(f"Bank {i+1} assigned {len(idxs)} samples ({fraud_ratio:.2%} fraud ratio).")
        
    return client_data

def partition_non_iid(X, y, num_clients=5, alpha=0.5, seed=42):
    """Alias wrapper for Dirichlet Non-IID partitioning."""
    return partition_dirichlet(X, y, num_clients=num_clients, alpha=alpha, seed=seed)

def create_bank_clients(X, y, num_clients=5, partition_type="dirichlet", alpha=0.5, seed=42):
    """Create client datasets dictionary using selected partitioning method."""
    if partition_type == "iid":
        return partition_iid(X, y, num_clients=num_clients, seed=seed)
    else:
        return partition_dirichlet(X, y, num_clients=num_clients, alpha=alpha, seed=seed)
