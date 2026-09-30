import React, { useEffect, useState } from 'react';
import { FileText, ShieldAlert, CheckCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { getExplainability } from '../services/api';

export default function Explainability() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getExplainability();
        if (res.success) setReports(res.audit_reports);
      } catch (err) {
        console.error("Failed to load explainability audit reports", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText style={{ color: 'var(--accent-mustard)' }} /> Explainable AI (XAI) Governance & Decision Reports
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Provides transparent, auditable natural language rationale for why specific bank updates were accepted, monitored, or rejected.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading audit reports...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reports.map((r, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', borderLeft: r.decision === 'REJECTED' ? '6px solid var(--negative-red)' : '6px solid var(--positive-forest)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-dark)' }}>{r.bank_id}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Overall Context Score: {r.final_trust} / 100</span>
                </div>
                <span className={r.decision === 'REJECTED' ? 'badge-rejected' : 'badge-trusted'} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  {r.decision}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} style={{ color: 'var(--accent-terracotta)' }} /> Rationale & Explanation:
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {r.reasons.map((reason, i) => (
                    <li key={i} style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'var(--primary-mild)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={18} style={{ color: 'var(--accent-mustard)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                  <strong>Governance Recommendation:</strong> {r.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
