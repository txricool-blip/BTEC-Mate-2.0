import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Resources from './pages/Resources';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import { NavTab } from './types';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case NavTab.HOME:
        return <Home navigate={setActiveTab} />;
      case NavTab.CHAT:
        return <Chat navigate={setActiveTab} />;
      case NavTab.RESOURCES:
        return <Resources navigate={setActiveTab} />;
      case NavTab.NOTES:
        return <Notes navigate={setActiveTab} />;
      case NavTab.PROFILE:
        return <Profile navigate={setActiveTab} />;
      default:
        return <Home navigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;