import { useState, useEffect } from 'react';
import { categoriasService, type CategoriaProducto } from '../services/categorias.service';
import { useUserRole } from '../hooks/useUserRole';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CategoriasPage() {
  const { isAdministrador } = useUserRole();
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaProducto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriasService.getAll();
      setCategorias(data);
    } catch (error) {
      alert('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategoria) {
        await categoriasService.update(editingCategoria.documentId, formData);
      } else {
        await categoriasService.create(formData);
      }
      
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '' });
      setEditingCategoria(null);
      loadCategorias();
    } catch (error) {
      alert('Error al guardar la categoría');
    }
  };

  const handleEdit = (categoria: CategoriaProducto) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (categoria: CategoriaProducto) => {
    console.log('Intentando eliminar categoría:', categoria);
    console.log('documentId:', categoria.documentId);
    
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      console.log('Llamando a categoriasService.delete con documentId:', categoria.documentId);
      await categoriasService.delete(categoria.documentId);
      alert('Categoría eliminada exitosamente');
      loadCategorias();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la categoría. Puede que esté siendo utilizada por productos.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ nombre: '', descripcion: '' });
    setEditingCategoria(null);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando categorías..." />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Gestión de Categorías</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-primary-dark)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          + Nueva Categoría
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{categoria.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{categoria.nombre}</td>
                <td style={{ padding: '12px' }}>{categoria.descripcion || '-'}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(categoria)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--color-primary-dark)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontSize: '12px'
                    }}
                  >
                    Editar
                  </button>
                  {isAdministrador && (
                    <button
                      onClick={() => handleDelete(categoria)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--color-danger)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categorias.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No hay categorías registradas
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
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
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-primary-dark)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
