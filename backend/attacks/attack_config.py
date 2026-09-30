from backend.config import POISONING_RATE, ATTACK_TYPE, TARGET_FEATURE, TARGET_RANGE

class AttackConfig:
    """Configuration container for simulated poisoning attacks."""
    def __init__(self, attack_type=ATTACK_TYPE, poisoning_rate=POISONING_RATE,
                 target_feature=TARGET_FEATURE, target_range=TARGET_RANGE, scaling_factor=-2.0):
        self.attack_type = attack_type
        self.poisoning_rate = poisoning_rate
        self.target_feature = target_feature
        self.target_range = target_range
        self.scaling_factor = scaling_factor

    def to_dict(self):
        return {
            "attack_type": self.attack_type,
            "poisoning_rate": self.poisoning_rate,
            "target_feature": self.target_feature,
            "target_range": list(self.target_range),
            "scaling_factor": self.scaling_factor
        }
