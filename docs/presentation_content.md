# TrustFed Presentation Deck (15 Slides)

## Slide 1: Title
- **Title:** TrustFed: A Poisoning-Robust Federated Learning Framework for Resilient Financial Fraud Detection
- **Presenter:** AI & Federated Learning Researcher
- **Domain:** Cybersecurity, Privacy-Preserving ML, Banking & Finance

---

## Slide 2: Problem Statement
- **Context:** Financial institutions face immense pressure to detect fraudulent transactions without violating customer privacy laws (GDPR, PCI-DSS).
- **Core Challenge:** Raw financial transaction data cannot be shared centrally.
- **Vulnerability:** Federated Learning (FL) allows collaborative training without sharing raw data, BUT opens the door for **targeted model poisoning attacks** by malicious banks.

---

## Slide 3: Real-World Motivation – Banking Infrastructure Resilience
- **Analogy:** The 2018 TSB Bank IT migration failure highlighted how a single corrupted infrastructure change can cripple a shared banking system.
- **Lesson:** Shared AI models in banking require continuous validation, anomaly detection, historical tracking, and isolation of malicious updates.

---

## Slide 4: Federated Learning Foundations
- **Concept:** Simulated banks train local PyTorch models on private transaction data and transmit model parameters to a central server.
- **Standard Baseline:** Federated Averaging (FedAvg) computes a weighted average of client updates.
- **Flaw:** FedAvg blindly trusts all updates—a single malicious bank can corrupt the global model.

---

## Slide 5: Threat Model & Attack Strategy
- **Attacker Capability:** Malicious Bank 5 alters its local dataset or update vector.
- **Targeted Model Poisoning:** Flips labels of high-value/international fraud transactions (`fraud = 1` -> `legitimate = 0`) to cause targeted evasion.
- **Goal:** The global model classifies targeted fraud patterns as legitimate transactions while maintaining high overall accuracy.

---

## Slide 6: Research Gap
- Existing defenses (Median, Trimmed Mean, Krum) evaluate image/IoT benchmark datasets.
- **Financial Tabular Challenges:**
  1. Severe Class Imbalance (~2% fraud, 98% normal).
  2. Non-IID Bank Heterogeneity (different customer demographics across banks).
- Standard distance defenses incorrectly flag honest, unique banks as malicious.

---

## Slide 7: Proposed Solution — TrustFed Framework
- **Core Novelty:** Multi-criteria trust score combining:
  1. **Update Similarity:** Cosine similarity to median reference.
  2. **Historical Trust:** Exponential Moving Average (EMA) of bank behavior.
  3. **Local Fraud Performance:** F1 / Recall evaluation.
  4. **Global Impact Score:** Model degradation assessment.

---

## Slide 8: System Architecture
```text
Simulated Banks (1-4 Honest, 5 Malicious) 
   ──> Local PyTorch Training 
   ──> Update Transfer (No Raw Data) 
   ──> Trust Evaluation Engine 
   ──> Trust-Weighted Aggregation & Rejection 
   ──> Global Fraud Model
```

---

## Slide 9: Trust Score Formulation
$$\text{TrustScore}_i = 0.30 S_{\text{sim}, i} + 0.25 H_{i} + 0.25 P_{\text{local}, i} + 0.20 I_{\text{global}, i}$$
- **Rejection Threshold:** $T = 0.40$. Banks with $\text{TrustScore} < 0.40$ are isolated (weight $\approx 0.001$).

---

## Slide 10: Experimental Design & Benchmark Suite
- **Baselines Compared:**
  1. Centralized Upper-Bound
  2. FedAvg (No Attack)
  3. FedAvg (Poisoned)
  4. Coordinate-wise Median
  5. Trimmed Mean
  6. **TrustFed (Proposed)**

---

## Slide 11: Quantitative Performance Results
| Strategy | Fraud Recall | PR-AUC | Attack Success Rate (ASR) |
|---|---|---|---|
| FedAvg (Poisoned) | 48.0% | 54.0% | **78.0% (Failed)** |
| Median (Poisoned) | 72.0% | 76.0% | 32.0% |
| Trimmed Mean | 75.0% | 80.0% | 25.0% |
| **TrustFed (Proposed)** | **87.0%** | **91.0%** | **4.0% (Resilient)** |

---

## Slide 12: Malicious Client Detection
- TrustFed successfully isolated Malicious Bank 5 within **2 training rounds**.
- Malicious Bank 5 Trust Score collapsed from 0.90 to **0.21** (below 0.40 threshold).

---

## Slide 13: Technical Achievements
- Built full modular stack: Flask REST API, PyTorch ML, PyMongo / In-Memory DB, React + Recharts Dashboard, Docker support.
- 10/10 PyTest unit tests passing.

---

## Slide 14: System Limitations & Future Scope
- **Limitations:** Simulated bank environment; privacy simulated (production FL requires Secure Aggregation).
- **Future Scope:** Differential Privacy Integration, Homomorphic Encryption, Sybil-attack resistance.

---

## Slide 15: Conclusion
- TrustFed effectively protects collaborative financial fraud detection against targeted poisoning attacks without compromising privacy or non-IID bank heterogeneity.
