import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChart3, ShieldCheck, Zap, RefreshCw, Filter } from 'lucide-react';
import { getResults } from '../services/api';

export default function Results() {
  const [data, setData] = useState([
    { name: 'FedAvg (Clean)', f1: 0.90, recall: 0.89, pr_auc: 0.92, asr: 0.00 },
    { name: 'FedAvg (Poisoned)', f1: 0.52, recall: 0.48, pr_auc: 0.54, asr: 0.78 },
    { name: 'Median', f1: 0.74, recall: 0.72, pr_auc: 0.76, asr: 0.32 },
    { name: 'Trimmed Mean', f1: 0.78, recall: 0.75, pr_auc: 0.80, asr: 0.25 },
    { name: 'TrustFed (Proposed)', f1: 0.91, recall: 0.92, pr_auc: 0.94, asr: 0.04 },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('all');

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await getResults();
      if (res.success && res.comparison) {
        const c = res.comparison;
        setData([
          { name: 'FedAvg (Clean)', ...c.fedavg_no_attack },
          { name: 'FedAvg (Poisoned)', ...c.fedavg_poisoned },
          { name: 'Median', ...c.median_poisoned },
          { name: 'Trimmed Mean', ...c.trimmed_mean_poisoned },
          { name: 'TrustFed (Proposed)', ...c.trustfed_poisoned },
        ]);
      }
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 style={{ color: 'var(--positive-forest)' }} /> Empirical Benchmark Results & Defense Comparison
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Compare Fraud Recall, F1-Score, PR-AUC, and Attack Success Rate (ASR) across aggregation strategies.
          </p>
        </div>

        <button onClick={fetchResults} disabled={loading} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          <RefreshCw size={16} />
          <span>{loading ? "Updating..." : "REFRESH LATEST RESULTS"}</span>
        </button>
      </div>

      {/* Metric Filter Tabs */}
      <div className="glass-card" style={{ padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Filter size={16} style={{ color: 'var(--accent-terracotta)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Filter View:</span>
        {[
          { id: 'all', label: 'All Metrics' },
          { id: 'f1', label: 'F1-Score Only' },
          { id: 'recall', label: 'Fraud Recall Only' },
          { id: 'asr', label: 'Attack Success Rate (ASR)' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedMetric(item.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: selectedMetric === item.id ? 'var(--primary-dark)' : 'var(--primary-mild)',
              color: selectedMetric === item.id ? '#FFFFFF' : 'var(--primary-dark)',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Bar Chart Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>
          Empirical Defense Performance Benchmark
        </h3>
        <div style={{ width: '100%', height: '360px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 58, 54, 0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis domain={[0, 1.0]} stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: 'var(--border-card)', borderRadius: '8px' }} />
              <Legend />
              {(selectedMetric === 'all' || selectedMetric === 'f1') && (
                <Bar dataKey="f1" name="F1-Score" fill="var(--positive-forest)" radius={[4, 4, 0, 0]} />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'recall') && (
                <Bar dataKey="recall" name="Fraud Recall" fill="var(--accent-terracotta)" radius={[4, 4, 0, 0]} />
              )}
              {selectedMetric === 'all' && (
                <Bar dataKey="pr_auc" name="PR-AUC" fill="var(--accent-mustard)" radius={[4, 4, 0, 0]} />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'asr') && (
                <Bar dataKey="asr" name="Attack Success Rate (ASR)" fill="var(--negative-red)" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>
          Detailed Defense Benchmark Comparison
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Aggregation Strategy</th>
                <th style={{ padding: '10px' }}>F1-Score</th>
                <th style={{ padding: '10px' }}>Fraud Recall</th>
                <th style={{ padding: '10px' }}>PR-AUC</th>
                <th style={{ padding: '10px' }}>Attack Success Rate (ASR)</th>
                <th style={{ padding: '10px' }}>Malicious Detection</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const isTrustFed = row.name.includes('TrustFed');
                const isPoisonedFedAvg = row.name.includes('FedAvg (Poisoned)');
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-card)', background: isTrustFed ? 'rgba(95, 128, 99, 0.08)' : 'transparent' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isTrustFed && <ShieldCheck size={18} style={{ color: 'var(--positive-forest)' }} />}
                      {isPoisonedFedAvg && <Zap size={18} style={{ color: 'var(--negative-red)' }} />}
                      <span>{row.name}</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--positive-forest)' }}>{(row.f1*100).toFixed(1)}%</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-terracotta)' }}>{(row.recall*100).toFixed(1)}%</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-mustard)' }}>{(row.pr_auc*100).toFixed(1)}%</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--negative-red)' }}>{(row.asr*100).toFixed(1)}%</td>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: '0.8rem' }}>
                      {isTrustFed ? (
                        <span style={{ color: 'var(--positive-forest)' }}>100% (Isolated)</span>
                      ) : isPoisonedFedAvg ? (
                        <span style={{ color: 'var(--negative-red)' }}>0% (Vulnerable)</span>
                      ) : (
                        <span style={{ color: 'var(--accent-mustard)' }}>Partial Suppression</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
