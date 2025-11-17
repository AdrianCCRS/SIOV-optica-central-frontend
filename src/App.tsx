import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useUserRole } from './hooks/useUserRole';
import { ROLE_INITIAL_PAGES } from './types/roles';
import ProtectedRoute from './components/ProtectedRoute';
import AppLoading from './components/AppLoading';
import Header from './components/Header';
import POSPage from './pages/POSPage';
import VentasDelDiaPage from './pages/VentasDelDiaPage';
import { HistoricoVentasPage } from './pages/HistoricoVentasPage';
import ProductosBodegaPage from './pages/ProductosBodegaPage';
import CategoriasPage from './pages/CategoriasPage';
import MovimientosInventarioPage from './pages/MovimientosInventarioPage';
import DashboardPage from './pages/DashboardPage';
import ClientesAdminPage from './pages/ClientesAdminPage';
import InactiveUserPage from './pages/InactiveUserPage';

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
type AdminPage = 'dashboard' | 'productos' | 'categorias' | 'movimientos' | 'clientes' | 'ventas' | 'historico';

function AppContent() {
  const { initAuth } = useAuthStore();
  const { role, isAdministrador, isBodeguero, isCajero, isLoading, user } = useUserRole();
  const [currentPage, setCurrentPage] = useState<POSPage | BodegaPage | AdminPage>('pos');
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  // Determinar página inicial según el rol
  useEffect(() => {
    if (!isLoading && user?.role) {
      const initialPage = ROLE_INITIAL_PAGES[role];
      setCurrentPage(initialPage);
    }
  }, [user, isLoading, role]);

  // Mostrar loader mientras se cargan los datos del usuario
  if (isLoading) {
    return <AppLoading message="Verificando credenciales" />;
  }

  // Si hay usuario pero no tiene rol definido, seguir mostrando loader
  // Esto previene el flash de contenido incorrecto mientras se carga el rol
  if (user && !user.role?.type) {
    return <AppLoading message="Cargando perfil de usuario" />;
  }

  // Verificar si el usuario está inactivo (activo = false)
  if (user && user.activo === false) {
    return <InactiveUserPage />;
  }

  const handleNavigate = (page: POSPage | BodegaPage | AdminPage) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    // Si es administrador, mostrar páginas admin completas
    if (isAdministrador) {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardPage />;
        case 'productos':
          return <ProductosBodegaPage />;
        case 'categorias':
          return <CategoriasPage />;
        case 'movimientos':
          return <MovimientosInventarioPage />;
        case 'clientes':
          return <ClientesAdminPage />;
        case 'ventas':
          return <VentasDelDiaPage />;
        case 'historico':
          return <HistoricoVentasPage />;
        default:
          return <DashboardPage />;
      }
    }
    
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
    
    // Si es cajero o rol por defecto, mostrar páginas de POS
    if (isCajero) {
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

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
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
