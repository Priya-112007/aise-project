# TrustFed: A Poisoning-Robust Federated Learning Framework for Resilient Financial Fraud Detection

## ABSTRACT
Federated Learning (FL) enables financial institutions to collaboratively train fraud detection models without sharing sensitive raw customer transaction records. However, FL is inherently vulnerable to targeted model poisoning attacks, where malicious bank nodes transmit corrupted updates to manipulate the global model into misclassifying specific fraud patterns as legitimate transactions. Existing Byzantine-robust aggregation algorithms (such as Median, Trimmed Mean, or Krum) often fail in financial tabular environments due to the combined challenges of extreme class imbalance (~2% fraud ratio) and naturally non-IID bank-level data distributions. This paper proposes **TrustFed**, a novel trust-aware poisoning defense mechanism. TrustFed formulates a multi-criteria trust score combining update similarity, historical behavior (via Exponential Moving Average), local validation performance, and global impact. Experimental results across 5 simulated banks demonstrate that TrustFed reduces the Attack Success Rate (ASR) from **78.0% (under poisoned FedAvg)** down to **4.0%**, while recovering global model F1-score to **0.89** and PR-AUC to **0.91**.

---

## 1. INTRODUCTION
Financial fraud detection relies heavily on machine learning to analyze transaction features. However, strict data protection regulations (e.g., GDPR, PCI-DSS) prevent banks from pooling raw customer records into a centralized database. Federated Learning solves this privacy challenge by keeping raw data local to each bank. However, opening FL to multiple autonomous entities introduces serious security vulnerabilities: an adversarial bank can inject poisoned updates to corrupt the global decision surface.

---

## 2. PROBLEM STATEMENT
"In Federated Learning for financial fraud detection, banks cannot share raw transaction data due to privacy constraints. However, a malicious participating bank can send poisoned model updates to the central server and manipulate the global model. This project proposes TrustFed, a trust-aware poisoning defense mechanism that evaluates bank updates using update similarity, historical behavior, and fraud-specific performance before aggregation."

---

## 3. REAL-WORLD MOTIVATION
The 2018 TSB Bank IT migration failure serves as a high-level system analogy: a single problematic infrastructure update disrupted shared financial systems across the UK. Similarly, in shared AI models, a single unvalidated, poisoned model update sent by one bank could compromise fraud detection for all participating institutions. Financial AI systems require validation, anomaly detection, historical behavior tracking, and dynamic client isolation.

---

## 4. SYSTEM ARCHITECTURE & METHODOLOGY
TrustFed implements a multi-tier modular architecture:
1. **Simulated Bank Clients:** 5 banking nodes with Dirichlet Non-IID data partitioning ($\alpha = 0.5$).
2. **Local PyTorch Classifier:** 3-layer MLP Binary Classifier trained with weighted BCE loss.
3. **Targeted Poisoning Attack Module:** Flips targeted fraud labels ($y=1 \rightarrow 0$) or scales parameter updates.
4. **TrustFed Defense Engine:** Evaluates composite trust:
   $$\text{TrustScore}_i = 0.30 S_{\text{sim}, i} + 0.25 H_{i} + 0.25 P_{\text{local}, i} + 0.20 I_{\text{global}, i}$$
5. **Trust-Weighted Aggregation:** Rejects updates with $\text{TrustScore} < 0.40$ and aggregates remaining clients proportionally to $w_i = \text{DataSize}_i \times (\text{TrustScore}_i)^2$.

---

## 5. EXPERIMENTAL RESULTS
Comparative evaluation over 10 FL rounds against baseline defenses:

| Defense Strategy | F1-Score | Fraud Recall | PR-AUC | Attack Success Rate (ASR) | Malicious Bank Detection |
|---|---|---|---|---|---|
| FedAvg (Clean) | 0.90 | 0.89 | 0.92 | 0.00% | N/A |
| FedAvg (Poisoned) | 0.52 | 0.48 | 0.54 | 78.00% | 0% (Failed) |
| Median (Poisoned) | 0.74 | 0.72 | 0.76 | 32.00% | Partial |
| Trimmed Mean | 0.78 | 0.75 | 0.80 | 25.00% | Partial |
| **TrustFed (Proposed)** | **0.89** | **0.87** | **0.91** | **4.00%** | **100% (Isolated)** |

---

## 6. LIMITATIONS & FUTURE SCOPE
- **Limitations:** Experiments conducted on simulated client nodes; privacy is simulated (production FL requires Secure Aggregation).
- **Future Scope:** Incorporating Differential Privacy (DP), Sybil attack resistance, and Homomorphic Encryption.

---

## 7. CONCLUSION
TrustFed successfully mitigates targeted model poisoning attacks in federated financial fraud detection while preserving non-IID bank heterogeneity and raw data privacy.
