import { useState, useEffect } from 'react';
//import { useQueryClient } from '@tanstack/react-query';
import { clientesService, type Cliente } from '../services/clientes.service';
import LoadingSpinner from '../components/LoadingSpinner';
import './styles/ClientesAdminPage.css';

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
    <div className="clientes-container">
      <div className="clientes-header">
        <h1 className="clientes-title">
          Gestión de Clientes
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-nuevo-cliente"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre, identificación o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de clientes */}
      <div className="table-wrapper">
        <table className="clientes-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header">
                Nombres
              </th>
              <th className="table-header">
                Apellidos
              </th>
              <th className="table-header">
                Identificación
              </th>
              <th className="table-header">
                Teléfono
              </th>
              <th className="table-header">
                Email
              </th>
              <th className="table-header table-header-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="table-row">
                  <td className="table-cell">{cliente.nombres}</td>
                  <td className="table-cell">{cliente.apellidos}</td>
                  <td className="table-cell">
                    <div className="identificacion-tipo">
                      {cliente.tipo_identificacion}
                    </div>
                    <div>{cliente.numero_identificacion}</div>
                  </td>
                  <td className="table-cell">{cliente.telefono || '-'}</td>
                  <td className="table-cell">{cliente.email || '-'}</td>
                  <td className="table-cell table-cell-center">
                    <div className="actions-container">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="btn-editar"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cliente)}
                        className="btn-eliminar"
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
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">
              {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2col">
                <div>
                  <label className="form-label">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-id">
                <div>
                  <label className="form-label">
                    Tipo Identificación *
                  </label>
                  <select
                    required
                    value={formData.tipo_identificacion}
                    onChange={(e) => setFormData({ ...formData, tipo_identificacion: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="NIT">NIT</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Número de Identificación *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.numero_identificacion}
                    onChange={(e) => setFormData({ ...formData, numero_identificacion: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group-last">
                <label className="form-label">
                  Dirección
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-guardar"
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
