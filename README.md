# SIOV POS Frontend

Sistema de Punto de Venta (POS) para óptica, desarrollado con React + Vite + TypeScript.

## 🚀 Tecnologías

- **React 18** - Librería UI
- **Vite** - Build tool ultrarrápido
- **TypeScript** - Tipado estático
- **Zustand** - Gestión de estado global (carrito)
- **TanStack Query (React Query)** - Gestión de estado del servidor y cache
- **Axios** - Cliente HTTP para consumir la API de Strapi

## 📁 Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
├── pages/             # Páginas de la aplicación
│   └── POSPage.tsx    # Página principal del POS
├── services/          # Servicios para consumir la API
│   ├── api.ts         # Configuración de Axios
│   ├── clientes.service.ts
│   ├── productos.service.ts
│   └── ventas.service.ts
├── store/             # Stores de Zustand
│   └── carritoStore.ts # Estado del carrito de compras
├── types/             # Tipos TypeScript personalizados
└── utils/             # Utilidades y helpers
```

## 🔧 Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   
   Copia el archivo `.env.example` a `.env` y configura la URL de tu API:
   ```env
   VITE_API_URL=http://localhost:1337/api
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## 🛒 Funcionalidades del POS

### Carrito de Compras (Store con Zustand)

El carrito usa Zustand para gestión de estado optimizada:

- ✅ Agregar productos al carrito
- ✅ Actualizar cantidades
- ✅ Eliminar productos
- ✅ Cálculo automático de subtotales, IVA y total
- ✅ Validación de stock disponible
- ✅ Limpieza del carrito

### Gestión de Ventas

- ✅ Búsqueda de productos por nombre o referencia
- ✅ Visualización de stock en tiempo real
- ✅ Selección de cliente
- ✅ Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- ✅ Registro transaccional de ventas
- ✅ Generación automática de facturas
- ✅ Actualización automática de inventario

## 🔌 Integración con Backend

El frontend se conecta con el backend Strapi a través de los siguientes endpoints:

### Productos
- `GET /api/productos` - Lista de productos activos
- `GET /api/productos?filters[...]` - Búsqueda de productos

### Clientes
- `GET /api/clientes` - Lista de clientes
- `GET /api/clientes?filters[...]` - Búsqueda de clientes
- `POST /api/clientes` - Crear nuevo cliente

### Ventas
- `POST /api/ventas/registrar` - Registrar nueva venta (transaccional)
- `GET /api/ventas/del-dia` - Ventas del día actual

## 🔐 Autenticación

El sistema está preparado para JWT authentication:

1. Los tokens se almacenan en `localStorage`
2. Se envían automáticamente en cada petición mediante interceptor de Axios
3. Redirección automática a login si el token expira (401)

**Nota:** Actualmente el backend tiene `auth: false` para testing. Para producción, habilitar autenticación.

## 🎨 Personalización

### Agregar nuevas páginas

1. Crear componente en `src/pages/`
2. Importar en `App.tsx`
3. (Opcional) Agregar rutas con `react-router-dom`

### Agregar nuevos servicios

1. Crear archivo en `src/services/`
2. Definir interfaces TypeScript
3. Implementar métodos usando la instancia de `api`

### Modificar estilos

- Estilos globales: `src/index.css`
- Estilos inline en componentes (temporal)
- Puedes agregar TailwindCSS o CSS Modules si lo prefieres

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Despliegue

Puedes desplegar en:
- **Vercel** (recomendado para Vite)
- **Netlify**
- **GitHub Pages**
- **Servidor propio** (nginx + archivos estáticos)

## 📝 Próximas Mejoras

- [ ] Implementar React Router para múltiples páginas
- [ ] Página de login y autenticación completa
- [ ] Dashboard con reportes y gráficas
- [ ] Gestión de inventario
- [ ] Historial de ventas
- [ ] Impresión de facturas
- [ ] Gestión de clientes (CRUD completo)
- [ ] Responsive design mejorado
- [ ] Temas (modo oscuro/claro)
- [ ] Notificaciones toast
- [ ] Validaciones de formularios con React Hook Form

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo `LICENSE` para más detalles.

