import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import POSPage from './pages/POSPage';
import VentasDelDiaPage from './pages/VentasDelDiaPage';
import { HistoricoVentasPage } from './pages/HistoricoVentasPage';
import ProductosBodegaPage from './pages/ProductosBodegaPage';
import CategoriasPage from './pages/CategoriasPage';
import MovimientosInventarioPage from './pages/MovimientosInventarioPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type POSPage = 'pos' | 'ventas' | 'historico';
type BodegaPage = 'productos' | 'categorias' | 'movimientos';

function AppContent() {
  const { initAuth, user, isLoading } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<POSPage | BodegaPage>('pos');
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  // Determinar página inicial según el rol
  useEffect(() => {
    if (!isLoading && user?.role) {
      const roleType = user.role.type?.toLowerCase();
      
      // Asignar página inicial según el rol
      switch (roleType) {
        case 'bodeguero':
          setCurrentPage('productos');
          break;
        case 'vendedor':
        case 'authenticated':
        default:
          setCurrentPage('pos');
          break;
      }
    }
  }, [user, isLoading]);

  const roleType = user?.role?.type?.toLowerCase();
  const isBodeguero = roleType === 'bodeguero';
  const isVendedor = roleType === 'vendedor' || roleType === 'authenticated';

  const renderPage = () => {
    // Si es bodeguero, mostrar páginas de bodega
    if (isBodeguero) {
      switch (currentPage) {
        case 'productos':
          return <ProductosBodegaPage />;
        case 'categorias':
          return <CategoriasPage />;
        case 'movimientos':
          return <MovimientosInventarioPage />;
        default:
          return <ProductosBodegaPage />;
      }
    }
    
    // Si es vendedor o rol por defecto, mostrar páginas de POS
    if (isVendedor) {
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
    }
    
    // Fallback: mostrar POS por defecto
    return <POSPage />;
  };

  // Mostrar spinner mientras carga antes del ProtectedRoute
  if (isLoading) {
    return <LoadingSpinner message="Cargando información del usuario..." size="lg" />;
  }

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
