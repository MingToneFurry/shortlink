import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Links } from '@/pages/Links';
import { CreateLink } from '@/pages/CreateLink';
import { EditLink } from '@/pages/EditLink';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';

function App() {
  const { isAuthenticated, isLoading, username, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={login} />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Dashboard username={username} onLogout={logout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/links" 
            element={
              isAuthenticated ? (
                <Links />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/links/new" 
            element={
              isAuthenticated ? (
                <CreateLink />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/links/:shortCode/edit" 
            element={
              isAuthenticated ? (
                <EditLink />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/analytics" 
            element={
              isAuthenticated ? (
                <Links />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/analytics/:shortCode" 
            element={
              isAuthenticated ? (
                <Analytics />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? (
                <Settings username={username} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
