# Academic References & Literature Bibliography

### 1. Federated Learning Foundations
- **Title:** Communication-Efficient Learning of Deep Networks from Decentralized Data
- **Authors:** H. B. McMahan, E. Moore, D. Ramage, S. Hampson, B. A. y Arcas
- **Year:** 2017
- **Venue:** Artificial Intelligence and Statistics (AISTATS)
- **Contribution:** Introduced the foundational Federated Averaging (FedAvg) algorithm.
- **Relates to TrustFed:** Serves as the primary baseline for non-robust federated learning aggregation.

---

### 2. Byzantine-Robust Federated Learning
- **Title:** Machine Learning With Adversaries: Byzantine Tolerant Gradient Descent
- **Authors:** P. Blanchard, E. M. El Mhamdi, R. Guerraoui, J. Stainer
- **Year:** 2017
- **Venue:** Advances in Neural Information Processing Systems (NeurIPS)
- **Contribution:** Proposed Krum robust aggregation for handling Byzantine workers.
- **Relates to TrustFed:** Baseline comparison algorithm implemented in TrustFed.

---

### 3. Model Poisoning in Federated Learning
- **Title:** How To Backdoor Federated Learning
- **Authors:** E. Bagdasaryan, A. Veit, Y. Hua, D. Estrin, V. Shmatikov
- **Year:** 2020
- **Venue:** International Conference on Artificial Intelligence and Statistics (AISTATS)
- **Contribution:** Demonstrated model poisoning and backdoor insertion in FL via update scaling.
- **Relates to TrustFed:** Motivates targeted model poisoning attack design in TrustFed.

---

### 4. Non-IID Federated Learning & Heterogeneity
- **Title:** Federated Learning with Non-IID Data
- **Authors:** Y. Zhao, M. Li, L. Lai, N. Suda, D. Civin, V. Chandra
- **Year:** 2018
- **Venue:** arXiv preprint arXiv:1806.00582
- **Contribution:** Analyzed weight divergence in FedAvg caused by non-IID data distributions.
- **Relates to TrustFed:** Inspires Dirichlet distribution partitioning for realistic bank simulation.

---

### 5. Financial Fraud Detection & Tabular ML
- **Title:** Credit Card Fraud Detection using Machine Learning Techniques
- **Authors:** S. Bhattacharyya, S. Jha, K. Tharakunnel, J. C. Westland
- **Year:** 2011
- **Venue:** Decision Support Systems
- **Contribution:** Examined class imbalance and evaluation metrics (PR-AUC, F1) in financial fraud detection.
- **Relates to TrustFed:** Standardizes evaluation metrics for imbalanced tabular data.
