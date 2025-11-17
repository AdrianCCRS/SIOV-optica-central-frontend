import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { usuariosService } from '../services/usuarios.service';

// Solo roles permitidos para crear/editar
const ROLES_PERMITIDOS = [
  { value: 'cajero', label: 'Cajero' },
  { value: 'bodeguero', label: 'Bodeguero' }
];

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<any | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosService.getAllUsuariosPermitidos();
      setUsuarios(data);
    } catch (error) {
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario: any) => {
    setUsuarioEdit(usuario);
    setShowModal(true);
  };

  const handleCreate = () => {
    setUsuarioEdit(null);
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header con botón, igual estilo que MovimientosInventarioPage */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: 0 }}>Gestión de Usuarios</h2>
        <button
          onClick={handleCreate}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-primary-dark)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Card + tabla con el mismo estilo que el segundo componente */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '700px',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #ddd',
              }}
            >
              <th style={{ padding: '12px', textAlign: 'center' }}>
                Nombres y apellidos
              </th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Username</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Rol</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Activo</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {u.nombres} {u.apellidos}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {u.username}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {u.email}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {u.role}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {u.activo ? 'Sí' : 'No'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    style={{
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      border: '1px solid #ddd',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleEdit(u)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#999',
            }}
          >
            No hay usuarios registrados
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{usuarioEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            {/* Formulario de usuario aquí */}
            <form>
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  defaultValue={usuarioEdit?.nombre || ''}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  defaultValue={usuarioEdit?.email || ''}
                />
              </div>
              {!usuarioEdit && (
                <div>
                  <label>Contraseña</label>
                  <input type="password" />
                </div>
              )}
              <div>
                <label>Rol</label>
                <select
                  defaultValue={usuarioEdit?.rol || ROLES_PERMITIDOS[0].value}
                >
                  {ROLES_PERMITIDOS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit">
                  {usuarioEdit ? 'Actualizar' : 'Crear'} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
