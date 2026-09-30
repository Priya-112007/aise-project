import React from 'react';
import { X, BookOpen } from 'lucide-react';

export default function FormulaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">TrustFed Defense Formulation & Algorithm</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-400 mb-1">Composite Trust Score Formula</h3>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mono text-emerald-400 text-center font-mono text-base">
              TrustScore_i = (w1 * S_sim,i) + (w2 * H_i) + (w3 * P_local,i) + (w4 * I_global,i)
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Where all components are normalized to [0, 1]. Configured Weights: w1=0.30 (Update Similarity), w2=0.25 (Historical Trust), w3=0.25 (Local Performance F1), w4=0.20 (Global Impact).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-blue-400">1. Update Similarity (S_sim)</h3>
            <p className="text-slate-300">
              Calculates cosine similarity between client update vector and the coordinate-wise median update: 
              <span className="mono text-xs text-blue-300"> cos_sim(u_i, u_median)</span>. Outlier updates receive lower scores.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-blue-400">2. Historical Trust Tracking (H_i)</h3>
            <p className="text-slate-300">
              Uses Exponential Moving Average (EMA) to prevent transient noise while penalizing persistent degradation: 
              <span className="mono text-xs text-blue-300"> H_i^(t) = α * Trust_i^(t) + (1-α) * H_i^(t-1)</span>.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-blue-400">3. Trust-Aware Weighted Aggregation & Rejection</h3>
            <p className="text-slate-300">
              Clients with <span className="mono text-red-400">TrustScore &lt; 0.40</span> are classified as <strong>SUSPICIOUS / REJECTED</strong> and their weight is suppressed (w_i ≈ 0). Trusted clients are aggregated proportionally to <span className="mono text-emerald-400 font-mono">w_i = DataSize_i * (TrustScore_i)^2</span>.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs">
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
}
