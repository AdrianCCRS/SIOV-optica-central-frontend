import { create } from 'zustand';
import type { Producto } from '../services/productos.service';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
  iva: number;
  total: number;
}

interface CarritoState {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto, cantidad: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  eliminarProducto: (productoId: number) => void;
  limpiarCarrito: () => void;
  calcularTotales: () => { subtotal: number; totalIva: number; total: number };
}

const calcularTotalesItem = (producto: Producto, cantidad: number) => {
  const subtotal = producto.precio_unitario * cantidad;
  const iva = (subtotal * producto.porcentaje_iva) / 100;
  const total = subtotal + iva;
  return { subtotal, iva, total };
};

export const useCarritoStore = create<CarritoState>((set, get) => ({
  items: [],

  agregarProducto: (producto, cantidad) => {
    const items = get().items;
    const itemExistente = items.find((item) => item.producto.id === producto.id);

    if (itemExistente) {
      // Si ya existe, actualizar cantidad
      set({
        items: items.map((item) =>
          item.producto.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                ...calcularTotalesItem(producto, item.cantidad + cantidad),
              }
            : item
        ),
      });
    } else {
      // Si no existe, agregar nuevo item
      set({
        items: [
          ...items,
          {
            producto,
            cantidad,
            ...calcularTotalesItem(producto, cantidad),
          },
        ],
      });
    }
  },

  actualizarCantidad: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().eliminarProducto(productoId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.producto.id === productoId
          ? {
              ...item,
              cantidad,
              ...calcularTotalesItem(item.producto, cantidad),
            }
          : item
      ),
    });
  },

  eliminarProducto: (productoId) => {
    set({
      items: get().items.filter((item) => item.producto.id !== productoId),
    });
  },

  limpiarCarrito: () => {
    set({ items: [] });
  },

  calcularTotales: () => {
    const items = get().items;
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalIva = items.reduce((sum, item) => sum + item.iva, 0);
    const total = items.reduce((sum, item) => sum + item.total, 0);
    return { subtotal, totalIva, total };
  },
}));
