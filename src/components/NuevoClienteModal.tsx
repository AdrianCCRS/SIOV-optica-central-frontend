import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '../services/clientes.service';
import type { Cliente } from '../services/clientes.service';

interface NuevoClienteModalProps {
  onClose: () => void;
  onClienteCreado: (cliente: Cliente) => void;
}

export default function NuevoClienteModal({ onClose, onClienteCreado }: NuevoClienteModalProps) {
  const [formData, setFormData] = useState({
    tipo_identificacion: 'cedula' as 'cedula' | 'ruc' | 'pasaporte',
    numero_identificacion: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: '',
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const crearClienteMutation = useMutation({
    mutationFn: clientesService.crearCliente,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      onClienteCreado(data);
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al crear cliente';
      setError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.tipo_identificacion || !formData.numero_identificacion || !formData.nombres || !formData.apellidos) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    crearClienteMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Nuevo Cliente</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Tipo de Identificación *
              </label>
              <select
                name="tipo_identificacion"
                value={formData.tipo_identificacion}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                required
              >
                <option value="cedula">Cédula</option>
                <option value="ruc">RUC</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Número de Identificación *
              </label>
              <input
                type="text"
                name="numero_identificacion"
                value={formData.numero_identificacion}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                placeholder="Ej: 1234567890"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                placeholder="Nombres del cliente"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                placeholder="Apellidos del cliente"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                placeholder="Ej: 0987654321"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Dirección
            </label>
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', minHeight: '60px' }}
              placeholder="Dirección completa del cliente"
            />
          </div>

          {error && (
            <div style={{
              padding: '10px',
              marginTop: '15px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={crearClienteMutation.isPending}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: crearClienteMutation.isPending ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                opacity: crearClienteMutation.isPending ? 0.7 : 1,
              }}
            >
              {crearClienteMutation.isPending ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>

          <p style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
            * Campos obligatorios
          </p>
        </form>
      </div>
    </div>
  );
}
