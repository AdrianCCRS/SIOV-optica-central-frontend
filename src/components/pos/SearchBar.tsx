interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Buscar..." }: SearchBarProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
    }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 18px',
          fontSize: '15px',
          border: '2px solid #e2e8f0',
          borderRadius: '10px',
          outline: 'none',
          transition: 'all 0.2s',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-dark)'}
        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
      />
    </div>
  );
}
