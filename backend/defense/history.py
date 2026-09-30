class TrustHistoryTracker:
    """
    Maintains historical trust scores for each bank across FL rounds
    using Exponential Moving Average (EMA).
    Formula: new_trust = alpha * current_score + (1 - alpha) * previous_trust
    """
    def __init__(self, alpha=0.3):
        self.alpha = alpha
        self.history = {}  # {bank_id: [score_r1, score_r2, ...]}

    def update(self, current_scores):
        """Update trust history with round current scores and return EMA historical scores."""
        ema_scores = {}
        for bank_id, curr_score in current_scores.items():
            if bank_id not in self.history or len(self.history[bank_id]) == 0:
                self.history[bank_id] = [curr_score]
                ema_scores[bank_id] = curr_score
            else:
                prev_trust = self.history[bank_id][-1]
                ema_trust = float(self.alpha * curr_score + (1.0 - self.alpha) * prev_trust)
                self.history[bank_id].append(ema_trust)
                ema_scores[bank_id] = ema_trust
        return ema_scores

    def get_history(self, bank_id):
        """Return historical trust progression list for bank_id."""
        return self.history.get(bank_id, [])

    def reset(self):
        """Reset historical trust tracking."""
        self.history = {}
