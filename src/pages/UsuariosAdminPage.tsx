import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { usuariosService } from '../services/usuarios.service';
import './styles/UsuariosAdminPage.css';
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

  const handleSubmit = (usuarioEdit: boolean, usuarioData: any, documentId: string | null) => {
    console.log('Datos del usuario a guardar:', usuarioData);
    usuarioEdit && documentId ? usuariosService.updateUsuario(documentId, usuarioData) : usuariosService.createUsuario(usuarioData);
  }
  if (loading) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  console.log(usuarios);

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
        <form
        onSubmit={(e) => {
          e.preventDefault();
          const nombres = (document.getElementById('nombres-input') as HTMLInputElement).value;
          const apellidos = (document.getElementById('apellidos-input') as HTMLInputElement).value;
          const email = (document.getElementById('email-input') as HTMLInputElement).value;
          const rol = (document.getElementById('rol-select') as HTMLSelectElement).value;
          const activo = (document.getElementById('activo-select') as HTMLSelectElement).value === 'true';
          const username = (document.getElementById('username-input') as HTMLInputElement).value;
          const data: any = {
          nombres,
          apellidos,
          email,
          rol,
          activo,
          username,
          };
          if (!usuarioEdit) {
          data.password = (document.getElementById('password-input') as HTMLInputElement).value;
          }
          handleSubmit(!!usuarioEdit, data, usuarioEdit ? usuarioEdit.documentId : null);}}
        >
          <div>
          <label htmlFor="nombres-input">Nombres</label>
          <input
            id="nombres-input"
            type="text"
            defaultValue={usuarioEdit?.nombres || ''}
          />
          </div>
          <div>
          <label htmlFor="apellidos-input">Apellidos</label>
          <input
            id="apellidos-input"
            type="text"
            defaultValue={usuarioEdit?.apellidos || ''}
          />
          </div>
          <div>
          <label htmlFor="username-input">Username</label>
          <input
            id="username-input"
            type="text"
            defaultValue={usuarioEdit?.username || ''}
          />
          </div>
          <div>
          <label htmlFor="email-input">Email</label>
          <input
            id="email-input"
            type="email"
            defaultValue={usuarioEdit?.email || ''}
          />
          </div>
          {!usuarioEdit && (
          <div>
            <label htmlFor="password-input">Contraseña</label>
            <input id="password-input" type="password" />
          </div>
          )}
          <div>
          <label htmlFor="rol-select">Rol</label>
          <select
            id="rol-select"
            defaultValue={usuarioEdit?.rol || ROLES_PERMITIDOS[0].value}
          >
            {ROLES_PERMITIDOS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
            ))}
          </select>
          </div>
          <div className="form-group">
          <label htmlFor="activo-select">Activo</label>
          <select
            id="activo-select"
            name="activo"
            defaultValue={
            usuarioEdit
            ? usuarioEdit.activo
            ? 'true'
            : 'false'
            : 'true'
            }
            style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            width: '100%',
            marginTop: '4px',
            }}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
          </div>
          <div className="modal-actions">
          <button
            type="button"
            className='cancel-btn'
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button type="submit" className='submit-btn'>
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
