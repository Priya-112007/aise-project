import React from 'react';
import { Info, BookOpen, ShieldAlert, Cpu, AlertCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-400" /> Research Problem, Motivation & Methodology
        </h2>
        <p className="text-sm text-slate-400">Technical documentation and theoretical background for TrustFed framework.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> 1. Main Research Problem
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          In Federated Learning for financial fraud detection, participating banks cannot share raw transaction data due to strict data privacy regulations (GDPR, PCI-DSS). However, a malicious bank can send poisoned model updates to the central server to manipulate the shared AI model—making targeted fraud patterns classify as legitimate transactions. TrustFed proposes a multi-criteria trust defense mechanism evaluating update similarity, historical behavior, and fraud-specific performance.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4 border-amber-500/30 bg-amber-950/10">
        <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> 2. Real-World Motivation: TSB IT Migration Analogy
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          The 2018 TSB Bank IT migration failure serves as a <em>high-level system analogy</em>: a single problematic infrastructure update disrupted millions of banking operations. In Federated Learning, an unvalidated, poisoned model update sent by one malicious bank could similarly compromise shared fraud detection across the entire banking ecosystem. Banking AI systems necessitate strict validation, anomaly detection, and isolation of suspicious changes.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
          <Cpu className="w-5 h-5" /> 3. Research Gap & TrustFed Novelty
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Existing Byzantine-robust defenses (Median, Trimmed Mean, Krum) evaluate model updates in general benchmark settings (e.g. image classification). Financial tabular data presents unique challenges: <strong>extreme class imbalance (~2% fraud)</strong> and <strong>naturally heterogeneous non-IID bank distributions</strong>. Traditional distance metrics misclassify legitimate outlier banks as malicious. TrustFed overcomes this by combining update similarity with historical trust, local validation metrics, and trust-weighted robust aggregation.
        </p>
      </div>
    </div>
  );
}
