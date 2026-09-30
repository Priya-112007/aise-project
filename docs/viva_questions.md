# TrustFed Viva Voce Preparation Guide (30 Questions & Answers)

### Q1: What is Federated Learning (FL)?
**Answer:** Federated Learning is a decentralized machine learning approach where multiple parties (e.g., banks) train a global model collaboratively without sharing their raw local data. Only model weight updates are transmitted to a central coordinator.

### Q2: Why is Federated Learning necessary for financial fraud detection?
**Answer:** Banks cannot share raw customer transaction data due to strict data privacy regulations (GDPR, PCI-DSS) and competitive privacy. FL allows banks to share fraud intelligence without exposing raw customer records.

### Q3: What is non-IID data?
**Answer:** Non-IID (Not Independently and Identically Distributed) data means that different participating banks have different data distributions (e.g., one bank serves international corporate clients while another serves local retail customers).

### Q4: Why is financial transaction data non-IID across banks?
**Answer:** Because each bank has different customer demographics, transaction types, geographic locations, and merchant specializations.

### Q5: What is a poisoning attack in Federated Learning?
**Answer:** A poisoning attack occurs when a malicious client sends manipulated data or corrupted model weight updates to the server to manipulate the global model's predictions.

### Q6: What is a targeted model poisoning attack?
**Answer:** In targeted poisoning, the attacker does not try to destroy the whole model. Instead, they manipulate the model to misclassify a specific targeted fraud pattern (e.g., high-value international transfers) as legitimate transactions.

### Q7: What is the Byzantine failure assumption in FL?
**Answer:** It assumes that arbitrary, untrusted, or adversarial clients may send malicious updates to corrupt the global model.

### Q8: What is Federated Averaging (FedAvg)?
**Answer:** FedAvg is the standard FL aggregation algorithm that computes a weighted average of client parameters based on their dataset size.

### Q9: Why is FedAvg vulnerable to poisoning attacks?
**Answer:** FedAvg assumes all clients are honest. It gives equal weight per sample, allowing a single malicious client with large updates to corrupt the global weights.

### Q10: What is robust aggregation?
**Answer:** Robust aggregation refers to server-side aggregation algorithms (like Median, Trimmed Mean, Krum, or TrustFed) designed to filter or down-weight malicious client updates.

### Q11: What is a Trust Score in TrustFed?
**Answer:** A composite numerical score between 0.0 and 1.0 assigned to each bank based on update similarity, historical behavior, local validation performance, and global impact.

### Q12: Why does TrustFed use historical behavior?
**Answer:** Historical tracking using Exponential Moving Average (EMA) prevents transient noise from penalizing a bank while quickly catching persistent malicious behavior over rounds.

### Q13: Why is cosine similarity alone insufficient for detecting malicious banks?
**Answer:** Because financial data is non-IID. An honest bank might have a unique customer base, making its update look like an outlier. Relying only on distance would penalize legitimate outlier banks.

### Q14: Why is accuracy an insufficient metric for financial fraud detection?
**Answer:** Financial fraud datasets are severely imbalanced (~98% legitimate, ~2% fraud). A dummy model predicting everything as "legitimate" achieves 98% accuracy but 0% fraud recall.

### Q15: Why is Precision-Recall AUC (PR-AUC) preferred for fraud detection?
**Answer:** PR-AUC focuses specifically on the rare positive class (fraud), making it a sensitive and accurate metric under extreme class imbalance.

### Q16: What is Attack Success Rate (ASR)?
**Answer:** ASR measures the percentage of targeted fraud samples that the poisoned global model incorrectly classifies as legitimate transactions.

### Q17: What is the main research contribution of TrustFed?
**Answer:** TrustFed introduces a multi-criteria trust defense that effectively distinguishes malicious bank updates from legitimate non-IID bank behavior in tabular fraud detection.

### Q18: How does targeted label poisoning work in TrustFed?
**Answer:** The attacker flips targeted fraud sample labels from 1 (fraud) to 0 (legitimate) inside its local training set before executing local SGD training.

### Q19: What threshold does TrustFed use to reject malicious banks?
**Answer:** By default, `TRUST_THRESHOLD = 0.40`. Any bank scoring below 0.40 has its aggregation weight reduced to near zero (`0.001`).

### Q20: What technology stack is used in TrustFed?
**Answer:** PyTorch for ML, Flask for REST API, PyMongo/MongoDB for database, React + Vite + Recharts for frontend dashboard, Docker Compose for containerization.

### Q21: What is Dirichlet distribution in data partitioning?
**Answer:** A mathematical distribution used to partition dataset indices among client banks with controllable feature/label skew via hyperparameter alpha ($\alpha$).

### Q22: What happens when alpha = 0.1 in Dirichlet partitioning?
**Answer:** The client datasets become highly skewed (extreme non-IID distribution).

### Q23: What is the role of BCEWithLogitsLoss with positive class weighting?
**Answer:** It penalizes misclassifying rare fraud samples more heavily than legitimate samples, boosting recall in imbalanced datasets.

### Q24: What is Model Update Scaling?
**Answer:** An attack strategy where the malicious client scales or reverses its model update vector before sending it to the server.

### Q25: How does TrustFed evaluate local model performance?
**Answer:** The server evaluates client validation F1-score and recall to ensure the update improves fraud detection capability.

### Q26: What real-world incident provides high-level motivation for TrustFed?
**Answer:** The 2018 TSB Bank IT migration failure, which demonstrated how a single problematic update can disrupt shared banking infrastructure.

### Q27: How does TrustFed handle raw transaction data privacy?
**Answer:** Raw transaction data never leaves the local simulated bank. Only model weight vectors are sent over the network.

### Q28: What is Krum aggregation?
**Answer:** A Byzantine-robust aggregation algorithm that selects the single client update closest to its $N-f-2$ nearest neighbors.

### Q29: What are the main limitations of TrustFed?
**Answer:** Simulated bank environment, synthetic dataset default, and non-cryptographic privacy (production FL requires Secure Aggregation).

### Q30: What is a key direction for future work in TrustFed?
**Answer:** Integrating Differential Privacy (DP) noise addition and Secure Multi-Party Computation (SMPC).
