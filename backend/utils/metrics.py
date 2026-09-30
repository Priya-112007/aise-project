import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, precision_recall_curve, auc, confusion_matrix
)

def compute_binary_metrics(y_true, y_pred, y_prob=None):
    """
    Calculate comprehensive evaluation metrics for imbalanced binary fraud detection.
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel() if cm.shape == (2, 2) else (0, 0, 0, 0)
    
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0
    fraud_detection_rate = rec  # Equivalent to recall
    
    roc_auc = 0.5
    pr_auc = 0.0
    if y_prob is not None:
        y_prob = np.array(y_prob)
        if len(np.unique(y_true)) > 1:
            try:
                roc_auc = roc_auc_score(y_true, y_prob)
            except Exception:
                roc_auc = 0.5
            try:
                p, r, _ = precision_recall_curve(y_true, y_prob)
                pr_auc = auc(r, p)
            except Exception:
                pr_auc = 0.0
                
    return {
        "accuracy": float(acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1": float(f1),
        "roc_auc": float(roc_auc),
        "pr_auc": float(pr_auc),
        "fpr": float(fpr),
        "fnr": float(fnr),
        "fraud_detection_rate": float(fraud_detection_rate)
    }

def compute_attack_success_rate(y_true_target, y_pred_target):
    """
    Compute Attack Success Rate (ASR) on targeted fraud samples:
    Ratio of targeted fraud samples misclassified as legitimate (y_pred == 0 when y_true == 1).
    """
    y_true_target = np.array(y_true_target)
    y_pred_target = np.array(y_pred_target)
    
    target_fraud_indices = np.where(y_true_target == 1)[0]
    if len(target_fraud_indices) == 0:
        return 0.0
        
    evaded = np.sum(y_pred_target[target_fraud_indices] == 0)
    asr = float(evaded / len(target_fraud_indices))
    return asr
