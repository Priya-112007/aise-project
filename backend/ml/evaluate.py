import torch
import numpy as np
from backend.utils.metrics import compute_binary_metrics
from backend.data.client_data import get_dataloader

def evaluate_model(model, X_test, y_test, batch_size=128):
    """
    Evaluate PyTorch FraudClassifier on test dataset and return metric dictionary.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    model.eval()
    
    dataloader = get_dataloader(X_test, y_test, batch_size=batch_size, shuffle=False)
    all_logits = []
    
    with torch.no_grad():
        for X_batch, _ in dataloader:
            X_batch = X_batch.to(device)
            logits = model(X_batch)
            all_logits.append(logits.cpu())
            
    if len(all_logits) == 0:
        return compute_binary_metrics(y_test, np.zeros_like(y_test))
        
    logits = torch.cat(all_logits, dim=0).squeeze(1).numpy()
    probs = 1.0 / (1.0 + np.exp(-logits))  # Sigmoid conversion
    preds = (probs >= 0.5).astype(int)
    
    metrics = compute_binary_metrics(y_test, preds, y_prob=probs)
    return metrics
