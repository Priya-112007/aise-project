import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Banks from './pages/Banks';
import FederatedLearning from './pages/FederatedLearning';
import AttackSimulation from './pages/AttackSimulation';
import ContextAnalysis from './pages/ContextAnalysis';
import TrustFedDefense from './pages/TrustFedDefense';
import DriftMonitoring from './pages/DriftMonitoring';
import Explainability from './pages/Explainability';
import Experiments from './pages/Experiments';
import Results from './pages/Results';
import Prediction from './pages/Prediction';
import About from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'fl':
        return <FederatedLearning />;
      case 'banks':
        return <Banks />;
      case 'attack':
        return <AttackSimulation />;
      case 'context':
        return <ContextAnalysis />;
      case 'trustfed':
        return <TrustFedDefense />;
      case 'drift':
        return <DriftMonitoring />;
      case 'explainability':
        return <Explainability />;
      case 'experiments':
        return <Experiments />;
      case 'results':
        return <Results />;
      case 'predict':
        return <Prediction />;
      case 'about':
        return <About />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <Header onReset={() => setActiveTab('overview')} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
