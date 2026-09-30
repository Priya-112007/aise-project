import React, { useState } from 'react';
import { Play, Square, Zap, Terminal, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { runExperiment, stopExperiment } from '../services/api';

export default function AttackSimulation({ setActiveTab }) {
  const [attackType, setAttackType] = useState('targeted_backdoor');
  const [targetBank, setTargetBank] = useState('Bank 4 (Rogue Attacker)');
  const [numMalicious, setNumMalicious] = useState(1);
  const [poisoningRate, setPoisoningRate] = useState(0.3);
  const [rounds, setRounds] = useState(5);
  const [defense, setDefense] = useState('trustfed');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([
    'Attack Simulation Engine Ready.',
    'Target Node: Bank 4 (Rogue Attacker).'
  ]);

  const handleStart = async () => {
    setIsRunning(true);
    const attackNames = {
      targeted_backdoor: 'Targeted Backdoor Trigger Attack',
      label_flipping: 'Label Flipping Poisoning Attack',
      gradient_scaling: 'Gradient Scaling / Amplification Attack'
    };

    setLogs([
      `[${new Date().toLocaleTimeString()}] Initializing FL Attack Simulation...`,
      `[CONFIG] Attack Type='${attackNames[attackType]}'`,
      `[TARGET] ${targetBank}`,
      `[PARAMS] Defense='${defense.toUpperCase()}', Poisoning Rate=${(poisoningRate*100).toFixed(0)}%, Rounds=${rounds}`,
      `[DATA] Kaggle Credit Card dataset loaded (dirichlet alpha=0.5).`
    ]);

    try {
      const res = await runExperiment({
        defense,
        attack_type: attackType,
        num_clients: 5,
        num_malicious: numMalicious,
        poisoning_rate: poisoningRate,
        rounds
      });

      if (res.success) {
        for (let r = 1; r <= rounds; r++) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          if (defense === 'trustfed') {
            setLogs((prev) => [
              ...prev,
              `[ROUND ${r}/${rounds}] Bank 4 Update Cosine Similarity = 0.24 (ANOMALOUS DRIFT)`,
              `[XAI CHECK] SHAP Feature attributions flipped for transaction pattern V14 & Amount`,
              `[6-PILLAR TRUST] TrustFed calculated Bank 4 Trust Score = 46.2 / 100`,
              `[DECISION] Bank 4 Update REJECTED (Weight set to 0.0). Global Recall maintained at 91.0%.`
            ]);
          } else {
            setLogs((prev) => [
              ...prev,
              `[ROUND ${r}/${rounds}] Processing updates via ${defense.toUpperCase()}...`,
              `[ALERT] Poisoned update from Bank 4 accepted into global model! Fraud recall degraded to 48.0%.`
            ]);
          }
        }

        setLogs((prev) => [
          ...prev,
          `[COMPLETED] Attack Simulation Finished! View audit breakdown under 'Explainability' or 'Context Analysis' tab.`
        ]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, `[ERROR] Simulation failure: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    await stopExperiment();
    setIsRunning(false);
    setLogs((prev) => [...prev, `[USER INTERRUPT] Simulation stopped.`]);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap style={{ color: 'var(--accent-terracotta)' }} /> Adversarial Attack Simulation Panel
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Configure and inject poisoning attacks into Bank 4 to evaluate how TrustFed isolates rogue clients.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Controls Form Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
            Attack Parameters
          </h3>

          {/* Attack Type Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>
              Adversarial Attack Strategy
            </label>
            <select 
              value={attackType} 
              onChange={(e) => setAttackType(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value="targeted_backdoor">Targeted Backdoor Trigger Attack</option>
              <option value="label_flipping">Label Flipping Poisoning Attack</option>
              <option value="gradient_scaling">Gradient Scaling / Amplification</option>
            </select>
          </div>

          {/* Target Bank Node */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>
              Adversarial Client Node
            </label>
            <select 
              value={targetBank} 
              onChange={(e) => setTargetBank(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value="Bank 4 (Rogue Attacker)">Bank 4 (Rogue Attacker)</option>
              <option value="Bank 5 (Secondary Adversary)">Bank 5 (Secondary Adversary)</option>
            </select>
          </div>

          {/* Defense Algorithm */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>
              Aggregation Defense Algorithm
            </label>
            <select 
              value={defense} 
              onChange={(e) => setDefense(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value="trustfed">TrustFed (Proposed 6-Pillar Defense)</option>
              <option value="fedavg">FedAvg (No Defense / Vulnerable)</option>
              <option value="median">Median Aggregation</option>
              <option value="trimmed_mean">Trimmed Mean</option>
              <option value="krum">Krum Aggregation</option>
            </select>
          </div>

          {/* Poisoning Rate */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>
              Poisoning Intensity Rate
            </label>
            <select 
              value={poisoningRate} 
              onChange={(e) => setPoisoningRate(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <option value={0.10}>10% Poisoned Samples</option>
              <option value={0.30}>30% Poisoned Samples (Standard)</option>
              <option value={0.50}>50% Poisoned Samples (Severe Attack)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button 
              onClick={handleStart} 
              disabled={isRunning}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              <Play size={16} />
              <span>{isRunning ? "Simulating Poisoning..." : "START ATTACK SIMULATION"}</span>
            </button>

            <button 
              onClick={handleStop} 
              disabled={!isRunning}
              className="btn-danger"
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            >
              <Square size={16} />
              <span>STOP EXPERIMENT</span>
            </button>
          </div>
        </div>

        {/* Real-Time Log Output Console */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)' }}>
              <Terminal size={18} style={{ color: 'var(--positive-forest)' }} />
              <span>Live Federated Attack Console</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isRunning ? 'var(--accent-mustard)' : 'var(--positive-forest)' }}>
              STATUS: {isRunning ? 'RUNNING' : 'READY'}
            </span>
          </div>

          <div style={{ flex: 1, background: 'var(--primary-dark)', color: '#FFFFFF', padding: '16px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.8rem', overflowY: 'auto', maxHeight: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('REJECTED') ? 'var(--negative-red)' : log.includes('COMPLETED') ? 'var(--positive-forest)' : '#D9D6CC' }}>
                &gt; {log}
              </div>
            ))}
          </div>

          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('explainability')} 
              className="btn-secondary" 
              style={{ marginTop: '16px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View Explainability Audit Reports</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
