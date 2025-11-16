import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import POSPage from './pages/POSPage';
import VentasDelDiaPage from './pages/VentasDelDiaPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { initAuth } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<'pos' | 'ventas'>('pos');

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {currentPage === 'pos' ? <POSPage /> : <VentasDelDiaPage />}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
