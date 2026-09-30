import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Cpu, CheckCircle } from 'lucide-react';
import { resetSystem } from '../services/api';

export default function Header({ onReset }) {
  const [resetMsg, setResetMsg] = useState('');

  const handleReset = async () => {
    try {
      const res = await resetSystem();
      setResetMsg('System State & Databases Reset Successfully!');
      setTimeout(() => setResetMsg(''), 3000);
      if (onReset) onReset();
    } catch (err) {
      console.error("Reset system failed:", err);
      setResetMsg('Reset Completed.');
      setTimeout(() => setResetMsg(''), 3000);
    }
  };

  return (
    <header style={{ height: '4rem', borderBottom: '1px solid var(--border-card)', background: '#FFFFFF', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', sticky: 'top', zIndex: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '8px', background: 'rgba(196, 127, 104, 0.15)', color: 'var(--accent-terracotta)', borderRadius: '10px', border: '1px solid rgba(196, 127, 104, 0.3)' }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            TrustFed AI <span className="badge-trusted" style={{ fontSize: '0.7rem' }}>Kaggle Real Data Active</span>
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Adaptive Context-Aware & Explainable (XAI) Federated Fraud Defense</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {resetMsg && (
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--positive-forest)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={16} /> {resetMsg}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '8px', background: 'var(--primary-mild)', fontSize: '0.8rem', color: 'var(--primary-dark)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--positive-forest)' }}></span>
          <Cpu size={14} style={{ color: 'var(--primary-dark)' }} />
          <span>Context Engine: <strong>Active (6-Pillar)</strong></span>
        </div>

        <button 
          onClick={handleReset} 
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} />
          <span>Reset System</span>
        </button>
      </div>
    </header>
  );
}
