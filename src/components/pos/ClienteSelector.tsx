interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  numero_identificacion: string;
}

interface ClienteSelectorProps {
  clientes: Cliente[];
  selectedClienteId: number | null;
  onSelectCliente: (clienteId: number) => void;
  onNewCliente: () => void;
}

export default function ClienteSelector({ 
  clientes, 
  selectedClienteId, 
  onSelectCliente, 
  onNewCliente 
}: ClienteSelectorProps) {
  return (
    <div style={{ marginBottom: '16px', flexShrink: 0 }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        fontSize: '12px',
        color: '#4a5568',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      }}>
        Cliente
      </label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <select
          value={selectedClienteId || ''}
          onChange={(e) => onSelectCliente(Number(e.target.value))}
          style={{
            flex: 1,
            padding: '10px 12px',
            fontSize: '14px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="">Seleccionar cliente...</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombres} {cliente.apellidos} - {cliente.numero_identificacion}
            </option>
          ))}
        </select>
        <button
          onClick={onNewCliente}
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--color-primary-dark)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.2)';
          }}
          title="Crear nuevo cliente"
        >
          + Nuevo
        </button>
      </div>
    </div>
  );
}
