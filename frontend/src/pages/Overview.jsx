import React, { useState, useEffect } from 'react';
import { Building2, ShieldAlert, Zap, Network, Activity, Award, ArrowRight } from 'lucide-react';
import { getMetrics, getBanks } from '../services/api';

export default function Overview({ setActiveTab }) {
  const [metrics, setMetrics] = useState({
    total_banks: 5,
    active_banks: 5,
    malicious_banks: 1,
    current_round: 5,
    global_f1: 0.91,
    global_recall: 0.92,
    global_pr_auc: 0.94,
    avg_trust: 87.4,
    detected_attacks: 1
  });

  useEffect(() => {
    getMetrics().then((res) => {
      if (res.success && res.metrics) setMetrics(res.metrics);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
          System Architecture & Overview
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Real-time status of simulated bank clients, active 6-pillar trust engine, and global FL model metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span>Total Banks</span>
            <Building2 size={18} style={{ color: 'var(--accent-terracotta)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{metrics.total_banks} Banks</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span style={{ color: 'var(--positive-forest)', fontWeight: 700 }}>4 Active</span> • <span style={{ color: 'var(--negative-red)', fontWeight: 700 }}>1 Rogue</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span>Global F1-Score</span>
            <Award size={18} style={{ color: 'var(--positive-forest)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--positive-forest)' }}>
            {(metrics.global_f1 * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            PR-AUC: {(metrics.global_pr_auc * 100).toFixed(1)}% | Recall: {(metrics.global_recall * 100).toFixed(1)}%
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span>Average Trust Score</span>
            <ShieldAlert size={18} style={{ color: 'var(--accent-mustard)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-mustard)' }}>
            {metrics.avg_trust.toFixed(1)} / 100
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cutoff: 40.0 | 1 Client Isolated
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            <span>FL Training Round</span>
            <Network size={18} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
            Round {metrics.current_round}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Dirichlet α = 0.5 (Non-IID)
          </div>
        </div>
      </div>

      {/* Visual Workflow Pipeline */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
          Privacy-Preserving Federated Workflow
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Raw transaction data stays 100% private inside each bank. Only model gradient parameters leave local bank nodes.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', textAlign: 'center' }}>
          {[
            { step: '1', title: 'Local Data', desc: 'Kaggle Credit Card Transactions' },
            { step: '2', title: 'Local Training', desc: 'PyTorch Model Training' },
            { step: '3', title: 'Gradient Transfer', desc: 'Weights Only (No Raw Data)' },
            { step: '4', title: '6-Pillar Trust Check', desc: 'Similarity, History, Quality, Drift, XAI' },
            { step: '5', title: 'Robust Aggregation', desc: 'Global Fraud Model Update' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--primary-mild)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-dark)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, margin: '0 auto 8px', fontSize: '0.9rem' }}>
                {s.step}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-dark)' }}>{s.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Shortcut Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <button onClick={() => setActiveTab('attack')} className="glass-card" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Zap size={22} style={{ color: 'var(--accent-terracotta)' }} />
            <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-dark)' }}>Run Attack Simulation</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Inject targeted backdoor or label flipping attacks into Bank 4.</div>
        </button>

        <button onClick={() => setActiveTab('context')} className="glass-card" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <ShieldAlert size={22} style={{ color: 'var(--accent-mustard)' }} />
            <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-dark)' }}>Inspect 6-Pillar Trust Scores</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Analyze similarity, data quality, drift, and explainability.</div>
        </button>

        <button onClick={() => setActiveTab('predict')} className="glass-card" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Activity size={22} style={{ color: 'var(--positive-forest)' }} />
            <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-dark)' }}>Test Fraud Prediction</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Submit transaction features and view XAI feature reasons.</div>
        </button>
      </div>
    </div>
  );
}
