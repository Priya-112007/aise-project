import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getBanks } from '../services/api';

export default function Banks() {
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    getBanks().then((res) => {
      if (res.success && res.banks) setBanks(res.banks);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 style={{ color: 'var(--accent-terracotta)' }} /> Simulated Bank Institutions
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Monitoring 5 simulated banking nodes holding non-IID transaction data distributions and active trust statuses.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Bank ID</th>
                <th style={{ padding: '10px' }}>Behavior Type</th>
                <th style={{ padding: '10px' }}>Context Trust Score</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Local Samples</th>
                <th style={{ padding: '10px' }}>Distribution Profile</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((b) => (
                <tr key={b.bank_id} style={{ borderBottom: '1px solid var(--border-card)' }}>
                  <td style={{ padding: '14px', fontWeight: 700, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={18} style={{ color: 'var(--accent-terracotta)' }} />
                    <span>{b.name}</span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {b.is_malicious ? (
                      <span style={{ color: 'var(--negative-red)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={14} /> Rogue Attacker
                      </span>
                    ) : (
                      <span style={{ color: 'var(--positive-forest)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Honest Bank
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, fontSize: '1rem', color: b.trust_score < 0.4 ? 'var(--negative-red)' : 'var(--positive-forest)' }}>
                    {b.trust_score ? (b.trust_score > 1 ? b.trust_score : (b.trust_score * 100)).toFixed(1) : "91.0"} / 100
                  </td>
                  <td style={{ padding: '14px' }}>
                    {b.is_malicious || b.trust_score < 0.4 ? (
                      <span className="badge-rejected">REJECTED</span>
                    ) : b.trust_score < 0.7 ? (
                      <span className="badge-suspicious">SUSPICIOUS</span>
                    ) : (
                      <span className="badge-trusted">TRUSTED</span>
                    )}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>
                    {b.data_samples || 5000} records
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {b.bank_id === 'bank_1' && 'High retail transaction volume (JPMorgan)'}
                    {b.bank_id === 'bank_2' && 'Commercial transfers & genuine data drift (BofA)'}
                    {b.bank_id === 'bank_3' && 'International cross-border transactions (Wells Fargo)'}
                    {b.bank_id === 'bank_4' && 'Adversary: Targeted backdoor trigger injector'}
                    {b.bank_id === 'bank_5' && 'High-frequency digital payment transactions (Citigroup)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
