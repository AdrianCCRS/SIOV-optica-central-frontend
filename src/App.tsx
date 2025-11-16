import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import POSPage from './pages/POSPage';
import VentasDelDiaPage from './pages/VentasDelDiaPage';
import { HistoricoVentasPage } from './pages/HistoricoVentasPage';

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
  const [currentPage, setCurrentPage] = useState<'pos' | 'ventas' | 'historico'>('pos');

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const renderPage = () => {
    switch (currentPage) {
      case 'pos':
        return <POSPage />;
      case 'ventas':
        return <VentasDelDiaPage />;
      case 'historico':
        return <HistoricoVentasPage />;
      default:
        return <POSPage />;
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderPage()}
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
