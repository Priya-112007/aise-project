import React, { useState, useEffect } from 'react';
import { FlaskConical, Play, CheckCircle2 } from 'lucide-react';
import { runExperiment, getExperiments } from '../services/api';

export default function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [dataset, setDataset] = useState('creditcard');
  const [numClients, setNumClients] = useState(5);
  const [alpha, setAlpha] = useState(0.5);
  const [malicious, setMalicious] = useState(1);
  const [poisoningRate, setPoisoningRate] = useState(0.3);
  const [defense, setDefense] = useState('trustfed');
  const [rounds, setRounds] = useState(5);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    getExperiments().then((res) => {
      if (res.success && res.experiments) setExperiments(res.experiments);
    }).catch(() => {});
  }, []);

  const handleRun = async () => {
    setStatusMsg('Running benchmarking suite...');
    try {
      const res = await runExperiment({
        dataset,
        num_clients: numClients,
        alpha,
        num_malicious: malicious,
        poisoning_rate: poisoningRate,
        defense,
        rounds
      });
      if (res.success) {
        setStatusMsg('Benchmarking Run Executed Successfully!');
        getExperiments().then((r) => r.success && setExperiments(r.experiments));
      }
    } catch (e) {
      setStatusMsg(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FlaskConical style={{ color: 'var(--accent-terracotta)' }} /> Automated Experiment Suite & Benchmarks
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Configure parameters to run comparative experiments across defenses and log results in database records.
        </p>
      </div>

      {/* Configuration Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
          Benchmark Configuration Parameters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>Dataset</label>
            <select 
              value={dataset} 
              onChange={(e) => setDataset(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value="creditcard">Kaggle Credit Card Fraud Dataset (creditcard.csv)</option>
              <option value="demo">Synthetic Tabular Demo Dataset</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>Non-IID Dirichlet Alpha (α)</label>
            <select 
              value={alpha} 
              onChange={(e) => setAlpha(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value={0.1}>α = 0.1 (Extreme Heterogeneity)</option>
              <option value={0.5}>α = 0.5 (Moderate Heterogeneity - Default)</option>
              <option value={1.0}>α = 1.0 (Mild Non-IID)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>Defense Algorithm</label>
            <select 
              value={defense} 
              onChange={(e) => setDefense(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value="trustfed">TrustFed (Proposed 6-Pillar Defense)</option>
              <option value="fedavg">FedAvg (Vulnerable Baseline)</option>
              <option value="median">Median Aggregation</option>
              <option value="trimmed_mean">Trimmed Mean</option>
              <option value="krum">Krum Aggregation</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '16px' }}>
          <button onClick={handleRun} className="btn-primary" style={{ padding: '10px 24px' }}>
            <Play size={16} />
            <span>Execute Benchmarking Run</span>
          </button>
          {statusMsg && <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--positive-forest)' }}>{statusMsg}</span>}
        </div>
      </div>

      {/* History Table Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>
          Recorded Experiment History
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Experiment ID</th>
                <th style={{ padding: '10px' }}>Defense</th>
                <th style={{ padding: '10px' }}>Rounds</th>
                <th style={{ padding: '10px' }}>Malicious Banks</th>
                <th style={{ padding: '10px' }}>Poisoning Rate</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {experiments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No custom benchmark runs recorded yet. Click 'Execute Benchmarking Run' above.
                  </td>
                </tr>
              ) : (
                experiments.map((exp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-card)' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>{exp.experiment_id}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-dark)', textTransform: 'uppercase' }}>{exp.defense}</td>
                    <td style={{ padding: '12px' }}>{exp.rounds || 5}</td>
                    <td style={{ padding: '12px', color: 'var(--negative-red)', fontWeight: 600 }}>{exp.num_malicious || 1}</td>
                    <td style={{ padding: '12px' }}>{((exp.poisoning_rate || 0.3)*100).toFixed(0)}%</td>
                    <td style={{ padding: '12px', color: 'var(--positive-forest)', fontWeight: 700 }}>
                      <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> COMPLETED
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
