import LoadingSpinner from './LoadingSpinner';

interface AppLoadingProps {
  message?: string;
}

export default function AppLoading({ message = 'Inicializando aplicación...' }: AppLoadingProps) {
  return (
    <LoadingSpinner 
      message={message} 
      showBranding={true} 
      size="lg" 
      subtitle="Por favor espere..."
    />
  );
}
