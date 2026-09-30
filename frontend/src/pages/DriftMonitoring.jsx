import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { getDriftMonitoring } from '../services/api';

export default function DriftMonitoring() {
  const [driftHistory, setDriftHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getDriftMonitoring();
        if (res.success) setDriftHistory(res.drift_history);
      } catch (err) {
        console.error("Failed to load drift monitoring", err);
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
          <Activity style={{ color: 'var(--accent-sage)' }} /> Population Drift Monitoring & Disambiguation
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Differentiates natural financial data distribution shifts (e.g. seasonal transaction surges) from malicious poisoning attacks.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-dark)' }}>
          Population Stability Index (PSI) Over FL Training Rounds
        </h3>
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={driftHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 58, 54, 0.1)" />
              <XAxis dataKey="round" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[0, 0.35]} />
              <Tooltip contentStyle={{ background: '#FFFFFF', borderRadius: '8px', borderColor: 'var(--border-card)' }} />
              <Legend />
              <Line type="monotone" dataKey="psi" name="PSI Index" stroke="var(--accent-terracotta)" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {driftHistory.map((d, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px', borderLeft: d.psi > 0.2 ? '4px solid var(--accent-mustard)' : '4px solid var(--positive-forest)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>Round {d.round}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: d.psi > 0.2 ? 'var(--accent-mustard)' : 'var(--positive-forest)' }}>
                PSI = {d.psi}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Status:</strong> {d.status}
            </div>
            <div style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
              <strong>Observation:</strong> {d.bank_2_drift}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--positive-forest)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> {d.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
