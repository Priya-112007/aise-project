import React, { useState } from 'react';
import { Binary, ShieldCheck, AlertTriangle, Send, Info, CheckCircle, Lightbulb } from 'lucide-react';
import { predictFraud } from '../services/api';

export default function Prediction() {
  const [amount, setAmount] = useState(3250.00);
  const [frequency, setFrequency] = useState(48);
  const [accountAge, setAccountAge] = useState(12);
  const [isInternational, setIsInternational] = useState(1);
  const [deviceRisk, setDeviceRisk] = useState(0.88);
  const [userRisk, setUserRisk] = useState(0.82);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await predictFraud({
        amount: Number(amount),
        frequency: Number(frequency),
        account_age: Number(accountAge),
        is_international: Number(isInternational),
        device_risk_score: Number(deviceRisk),
        user_risk_score: Number(userRisk)
      });
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error("Prediction API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresets = (type) => {
    if (type === 'fraud') {
      setAmount(4200.00);
      setFrequency(65);
      setAccountAge(5);
      setIsInternational(1);
      setDeviceRisk(0.92);
      setUserRisk(0.88);
    } else {
      setAmount(45.50);
      setFrequency(12);
      setAccountAge(360);
      setIsInternational(0);
      setDeviceRisk(0.12);
      setUserRisk(0.15);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Binary style={{ color: 'var(--accent-terracotta)' }} /> Real-Time Explainable Fraud Prediction
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Submit transaction parameters to evaluate fraud probability AND view XAI feature attribution breakdowns explaining the decision.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Form Input Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-card)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Transaction Features</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handlePresets('legit')}
                style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(95, 128, 99, 0.15)', color: 'var(--positive-forest)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(95, 128, 99, 0.3)', cursor: 'pointer' }}
              >
                Legitimate Preset
              </button>
              <button 
                onClick={() => handlePresets('fraud')}
                style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(182, 92, 92, 0.15)', color: 'var(--negative-red)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(182, 92, 92, 0.3)', cursor: 'pointer' }}
              >
                Fraud Preset
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>Transaction Amount ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>30-day Frequency</label>
              <input 
                type="number" 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>Account Age (Days)</label>
              <input 
                type="number" 
                value={accountAge} 
                onChange={(e) => setAccountAge(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>International Tx</label>
              <select 
                value={isInternational} 
                onChange={(e) => setIsInternational(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              >
                <option value={1}>Yes (High Risk)</option>
                <option value={0}>No (Domestic)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '4px' }}>Device Risk Score (0-1)</label>
              <input 
                type="number" 
                step="0.05"
                value={deviceRisk} 
                onChange={(e) => setDeviceRisk(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button onClick={handlePredict} disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            <Send size={16} />
            <span>{loading ? "Computing XAI Prediction..." : "EVALUATE FRAUD & EXPLAIN"}</span>
          </button>
        </div>

        {/* Prediction Output & XAI Reasons Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {result ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'inline-block', padding: '12px', borderRadius: '50%', background: result.prediction === 'Fraud' ? 'rgba(182, 92, 92, 0.15)' : 'rgba(95, 128, 99, 0.15)', color: result.prediction === 'Fraud' ? 'var(--negative-red)' : 'var(--positive-forest)', marginBottom: '8px' }}>
                  {result.prediction === 'Fraud' ? <AlertTriangle size={36} /> : <ShieldCheck size={36} />}
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: result.prediction === 'Fraud' ? 'var(--negative-red)' : 'var(--positive-forest)' }}>
                  {result.prediction} ({result.confidence}%)
                </h3>
              </div>

              {/* XAI Reasons */}
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={16} style={{ color: 'var(--accent-mustard)' }} /> Top XAI Contribution Reasons:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(result.top_reasons || []).map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{r.feature}</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-terracotta)' }}>{r.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Binary size={40} style={{ margin: '0 auto 10px', color: 'var(--accent-sage)' }} />
              <p>Enter transaction details and click <strong>'EVALUATE FRAUD & EXPLAIN'</strong> to see confidence and feature reasons.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
