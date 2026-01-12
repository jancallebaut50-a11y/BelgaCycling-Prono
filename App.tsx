
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PronostiekPage from './pages/PronostiekPage';
import ResultsPage from './pages/ResultsPage';
import RankingPage from './pages/RankingPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RulesPage from './pages/RulesPage';
import RiderManagementPage from './pages/RiderManagementPage';
import { useData } from './hooks/useMockData';

const App: React.FC = () => {
  const { currentUser, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-400 text-xl font-bold animate-pulse">Loading BelgaCycling...</div>
      </div>
    );
  }

  const isAdmin = currentUser?.isAdmin || false;

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pronostiek" element={<PronostiekPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route 
              path="/admin" 
              element={isAdmin ? <AdminPage /> : <Navigate to="/login" replace />} 
            />
             <Route 
              path="/riders" 
              element={isAdmin ? <RiderManagementPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={<LoginPage />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
