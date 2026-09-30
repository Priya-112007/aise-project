import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Database, TrendingUp, HelpCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getContextAnalysis } from '../services/api';

export default function ContextAnalysis() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getContextAnalysis();
        if (res.success) setBanks(res.banks);
      } catch (err) {
        console.error("Failed to load context analysis", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getBarColor = (score) => {
    if (score >= 85) return 'var(--positive-forest)';
    if (score >= 60) return 'var(--accent-mustard)';
    return 'var(--negative-red)';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu style={{ color: 'var(--accent-terracotta)' }} /> Adaptive Context Analysis Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Evaluates participating bank nodes across 6 contextual pillars to compute dynamic, attack-resilient trust.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading context metrics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
          {banks.map((b, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{b.bank_id}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tier: {b.tier}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getBarColor(b.final_trust) }}>
                    {b.final_trust} / 100
                  </div>
                  <span className={b.status === 'ACCEPTED' ? 'badge-trusted' : 'badge-rejected'}>
                    {b.status}
                  </span>
                </div>
              </div>

              {/* 6 Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Update Similarity', score: b.similarity, weight: '20%' },
                  { label: 'Historical Behavior', score: b.history, weight: '20%' },
                  { label: 'Fraud Performance (Recall)', score: b.performance, weight: '20%' },
                  { label: 'Data Quality Score', score: b.quality, weight: '15%' },
                  { label: 'Drift Detection', score: b.drift, weight: '15%' },
                  { label: 'Explainability Consistency', score: b.explainability, weight: '10%' }
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{item.label} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({item.weight})</span></span>
                      <span style={{ fontWeight: 700, color: getBarColor(item.score) }}>{item.score}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--primary-mild)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.score}%`, height: '100%', background: getBarColor(item.score), borderRadius: '4px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
