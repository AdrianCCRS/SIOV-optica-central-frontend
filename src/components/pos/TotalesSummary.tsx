import { formatCurrency } from '../../utils/format';

interface TotalesSummaryProps {
  subtotal: number;
  totalIva: number;
  total: number;
}

export default function TotalesSummary({ subtotal, totalIva, total }: TotalesSummaryProps) {
  return (
    <div style={{
      marginTop: '12px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '14px',
      }}>
        <span style={{ color: '#718096', fontWeight: '500' }}>Subtotal:</span>
        <span style={{ fontWeight: '600', color: '#2d3748' }}>{formatCurrency(subtotal)}</span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '14px',
        paddingBottom: '12px',
        borderBottom: '2px solid #e2e8f0',
      }}>
        <span style={{ color: '#718096', fontWeight: '500' }}>IVA:</span>
        <span style={{ fontWeight: '600', color: '#2d3748' }}>{formatCurrency(totalIva)}</span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '18px',
      }}>
        <span style={{ fontWeight: '700', color: '#1a202c' }}>Total:</span>
        <span style={{ fontWeight: '700', color: '#4CAF50' }}>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
