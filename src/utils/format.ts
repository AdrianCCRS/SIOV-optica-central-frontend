/**
 * Formatea un número como moneda con separador de miles
 * @param value - El valor numérico a formatear
 * @returns String formateado como $1,234.56
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formatea un número con separador de miles sin símbolo de moneda
 * @param value - El valor numérico a formatear
 * @returns String formateado como 1,234.56
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};
