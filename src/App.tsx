import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import POSPage from './pages/POSPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <POSPage />
    </QueryClientProvider>
  );
}

export default App;
