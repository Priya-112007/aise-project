import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from backend.data.client_data import get_dataloader

def train_model(model, X_train, y_train, epochs=2, lr=0.001, batch_size=128, class_weights=True):
    """
    Train PyTorch FraudClassifier on local client dataset.
    Uses BCEWithLogitsLoss with positive class weight to tackle 98:2 class imbalance.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    model.train()
    
    # Calculate pos_weight for loss balancing if enabled
    if class_weights and len(np.unique(y_train)) > 1:
        num_neg = np.sum(y_train == 0)
        num_pos = np.sum(y_train == 1)
        pos_weight_val = float(num_neg / (num_pos + 1e-5))
        pos_weight = torch.tensor([pos_weight_val], dtype=torch.float32).to(device)
        criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
    else:
        criterion = nn.BCEWithLogitsLoss()
        
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)
    dataloader = get_dataloader(X_train, y_train, batch_size=batch_size, shuffle=True)
    
    epoch_losses = []
    for epoch in range(epochs):
        running_loss = 0.0
        for X_batch, y_batch in dataloader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            optimizer.zero_grad()
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * len(X_batch)
            
        epoch_loss = running_loss / len(X_train) if len(X_train) > 0 else 0.0
        epoch_losses.append(epoch_loss)
        
    return model, float(np.mean(epoch_losses))
