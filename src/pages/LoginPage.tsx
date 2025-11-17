import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import './styles/LoginPage.css';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      setError('');
      // Recargar la página para que App.tsx inicie desde cero con initAuth()
      window.location.href = import.meta.env.VITE_APP_BASE_URL || '/';
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al iniciar sesión';
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    loginMutation.mutate({ identifier, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Óptica Central - Sistema de Ventas
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">
              Usuario o Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ingresa tu usuario o email"
              className="login-input"
              disabled={loginMutation.isPending}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="login-input"
              disabled={loginMutation.isPending}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="login-button"
          >
            {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="login-version">
          Versión 1.0.0
        </p>
      </div>
    </div>
  );
}
