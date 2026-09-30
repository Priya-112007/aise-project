import React, { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, Scale, AlertOctagon } from 'lucide-react';
import { getTrustScores } from '../services/api';
import FormulaModal from '../components/FormulaModal';

export default function TrustFedDefense() {
  const [scores, setScores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getTrustScores().then((res) => {
      if (res.success && res.trust_scores) setScores(res.trust_scores);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ color: 'var(--positive-forest)' }} /> Adaptive 6-Pillar Trust Engine Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Multi-criteria weighted trust evaluation across update similarity, historical EMA, fraud recall, data quality, drift, and XAI.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <HelpCircle size={16} />
          <span>View Mathematical Formulation</span>
        </button>
      </div>

      {/* Formula Banner Card */}
      <div className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Scale size={20} style={{ color: 'var(--accent-terracotta)' }} />
          <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
            <strong>6-Pillar Weighted Formula:</strong> 0.20*Similarity + 0.20*History + 0.20*Recall + 0.15*Quality + 0.15*Drift + 0.10*Explainability
          </div>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--negative-red)' }}>
          Cutoff: <strong>40.0 / 100</strong>
        </span>
      </div>

      {/* Multi-Tier Weight Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>
          Multi-Tier Aggregation Policy Weights
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Trust Score Range</th>
                <th style={{ padding: '10px' }}>Tier Status</th>
                <th style={{ padding: '10px' }}>Aggregation Weight</th>
                <th style={{ padding: '10px' }}>Governance Policy</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'rgba(95, 128, 99, 0.08)' }}>
                <td style={{ padding: '12px', fontWeight: 800, color: 'var(--positive-forest)' }}>Trust &ge; 85.0</td>
                <td style={{ padding: '12px' }}><span className="badge-trusted">Full Trust</span></td>
                <td style={{ padding: '12px', fontWeight: 700 }}>1.0 (Full Weight)</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Included fully in global model aggregation.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '12px', fontWeight: 800, color: 'var(--primary-dark)' }}>60.0 &le; Trust &lt; 85.0</td>
                <td style={{ padding: '12px' }}><span className="badge-trusted">Monitored</span></td>
                <td style={{ padding: '12px', fontWeight: 700 }}>0.7 (Reduced Weight)</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Included with reduced weight to limit potential drift bias.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '12px', fontWeight: 800, color: 'var(--accent-mustard)' }}>40.0 &le; Trust &lt; 60.0</td>
                <td style={{ padding: '12px' }}><span className="badge-suspicious">Suspicious</span></td>
                <td style={{ padding: '12px', fontWeight: 700 }}>0.3 (Monitor Tier)</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Under close security audit; minimal weight allowed.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)', background: 'rgba(182, 92, 92, 0.08)' }}>
                <td style={{ padding: '12px', fontWeight: 800, color: 'var(--negative-red)' }}>Trust &lt; 40.0</td>
                <td style={{ padding: '12px' }}><span className="badge-rejected">Rejected</span></td>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--negative-red)' }}>0.0 (Isolated)</td>
                <td style={{ padding: '12px', color: 'var(--negative-red)', fontWeight: 600 }}>Completely filtered out to protect global model integrity.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <FormulaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
