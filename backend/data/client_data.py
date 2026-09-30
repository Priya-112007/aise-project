import torch
from torch.utils.data import Dataset, DataLoader

class TabularDataset(Dataset):
    """PyTorch Dataset wrapper for tabular features and labels."""
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

def get_dataloader(X, y, batch_size=128, shuffle=True):
    """Return PyTorch DataLoader for given X and y."""
    dataset = TabularDataset(X, y)
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
