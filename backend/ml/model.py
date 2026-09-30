import torch
import torch.nn as nn
import numpy as np

class FraudClassifier(nn.Module):
    """
    Multi-Layer Perceptron (MLP) Binary Classifier tailored for imbalanced tabular financial fraud.
    Architecture:
    Linear(input_dim -> hidden_dim1) -> ReLU -> Dropout -> Linear(hidden_dim1 -> hidden_dim2) -> ReLU -> Dropout -> Output(1)
    """
    def __init__(self, input_dim, hidden_dim1=64, hidden_dim2=32, dropout_rate=0.2):
        super(FraudClassifier, self).__init__()
        self.input_dim = input_dim
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim1),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(hidden_dim1, hidden_dim2),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(hidden_dim2, 1)
        )

    def forward(self, x):
        return self.net(x)

    def get_flat_parameters(self):
        """Return all trainable model parameters concatenated as a single 1D PyTorch tensor."""
        params = []
        for p in self.parameters():
            params.append(p.data.view(-1))
        return torch.cat(params)

    def set_flat_parameters(self, flat_params):
        """Set model parameters from a flattened 1D tensor."""
        offset = 0
        for p in self.parameters():
            numel = p.numel()
            p.data.copy_(flat_params[offset:offset + numel].view_as(p.data))
            offset += numel

    def get_parameters_dict(self):
        """Return state_dict with cloned tensor values."""
        return {k: v.clone() for k, v in self.state_dict().items()}

    def set_parameters_dict(self, state_dict):
        """Load state_dict into model."""
        self.load_state_dict(state_dict)
