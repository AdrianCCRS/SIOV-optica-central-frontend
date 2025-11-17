import { useState, useEffect } from 'react';
//import { useQueryClient } from '@tanstack/react-query';
import { clientesService, type Cliente } from '../services/clientes.service';
import LoadingSpinner from '../components/LoadingSpinner';
import './ClientesAdminPage.css';

export default function ClientesAdminPage() {
  //const queryClient = useQueryClient();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipo_identificacion: 'CC' as 'CC' | 'CE' | 'NIT' | 'Pasaporte',
    numero_identificacion: '',
    telefono: '',
    email: '',
    direccion: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clientesService.obtenerClientes();
      setClientes(data);
    } catch (error) {
      alert('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data: Omit<Cliente, 'id'> = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipo_identificacion: formData.tipo_identificacion,
        numero_identificacion: formData.numero_identificacion,
        telefono: formData.telefono || undefined,
        email: formData.email || undefined,
        direccion: formData.direccion || undefined,
      };

      if (editingCliente) {
        await clientesService.actualizarCliente(editingCliente.id, data);
      } else {
        await clientesService.crearCliente(data);
      }
      
      setShowModal(false);
      resetForm();
      loadData();
      alert(`Cliente ${editingCliente ? 'actualizado' : 'creado'} correctamente`);
    } catch (error: any) {
      alert(`Error al guardar el cliente: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      tipo_identificacion: cliente.tipo_identificacion,
      numero_identificacion: cliente.numero_identificacion,
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      direccion: cliente.direccion || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (!window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?\nNúmero de identificación: ${cliente.numero_identificacion}`)) {
      return;
    }

    try {
      await clientesService.eliminarCliente(cliente.id);
      loadData();
      alert('Cliente eliminado correctamente');
    } catch (error: any) {
      alert(`Error al eliminar el cliente: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      tipo_identificacion: 'CC',
      numero_identificacion: '',
      telefono: '',
      email: '',
      direccion: '',
    });
    setEditingCliente(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.numero_identificacion.includes(searchTerm) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner message="Cargando clientes..." size="lg" />;
  }

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8f9fa', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px' }}>
          Gestión de Clientes
        </h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, identificación o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '6px',
          }}
        />
      </div>

      {/* Tabla de clientes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>
                Nombres
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>
                Apellidos
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>
                Identificación
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>
                Teléfono
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#495057' }}>
                Email
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#495057' }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '16px', color: '#333' }}>{cliente.nombres}</td>
                  <td style={{ padding: '16px', color: '#333' }}>{cliente.apellidos}</td>
                  <td style={{ padding: '16px', color: '#333' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                      {cliente.tipo_identificacion}
                    </div>
                    <div>{cliente.numero_identificacion}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#333' }}>{cliente.telefono || '-'}</td>
                  <td style={{ padding: '16px', color: '#333' }}>{cliente.email || '-'}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(cliente)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cliente)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear/Editar Cliente */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 24px 0', color: '#333' }}>
              {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Nombres *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Tipo Identificación *
                  </label>
                  <select
                    required
                    value={formData.tipo_identificacion}
                    onChange={(e) => setFormData({ ...formData, tipo_identificacion: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="NIT">NIT</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Número de Identificación *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.numero_identificacion}
                    onChange={(e) => setFormData({ ...formData, numero_identificacion: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                  Dirección
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {editingCliente ? 'Actualizar' : 'Crear'} Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
