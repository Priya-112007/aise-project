import React from 'react';
import { 
  LayoutDashboard, Building2, Network, Zap, 
  ShieldAlert, FlaskConical, BarChart3, Binary, Info,
  Cpu, Activity, FileText
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'fl', label: 'Federated Learning', icon: Network },
    { id: 'banks', label: 'Banks', icon: Building2 },
    { id: 'attack', label: 'Attack Simulation', icon: Zap },
    { id: 'context', label: 'Context Analysis', icon: Cpu },
    { id: 'trustfed', label: 'Trust Engine', icon: ShieldAlert },
    { id: 'drift', label: 'Drift Monitoring', icon: Activity },
    { id: 'explainability', label: 'Explainability', icon: FileText },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'predict', label: 'Prediction', icon: Binary },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside style={{ width: '250px', background: '#FFFFFF', borderRight: '1px solid var(--border-card)', padding: '16px', minHeight: 'calc(100vh - 4rem)' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '8px' }}>
        TrustFed Navigation
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                background: isActive ? 'var(--primary-dark)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-main)',
                boxShadow: isActive ? '0 2px 8px rgba(59, 58, 54, 0.2)' : 'none'
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--accent-terracotta)' : 'var(--text-muted)' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
