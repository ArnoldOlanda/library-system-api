# Sistema de Gestión de Librería

## Descripción

Sistema completo de gestión para una librería implementado con NestJS, TypeORM y PostgreSQL. Incluye gestión de productos, categorías, clientes, proveedores, compras, ventas y arqueos de caja.

## Módulos Implementados

### 1. Categorías
- **Entidad**: `Categoria`
- **Endpoints**: `/categorias`
- **Permisos**: `CREATE_CATEGORIA`, `READ_CATEGORIA`, `UPDATE_CATEGORIA`, `DELETE_CATEGORIA`
- **Funcionalidades**:
  - Crear, listar, obtener, actualizar y eliminar categorías
  - Relación con productos

### 2. Productos
- **Entidad**: `Producto`
- **Endpoints**: `/productos`
- **Permisos**: `CREATE_PRODUCTO`, `READ_PRODUCTO`, `UPDATE_PRODUCTO`, `DELETE_PRODUCTO`
- **Funcionalidades**:
  - Gestión completa de productos
  - Control de stock y precios
  - Relación con categoría
  - Control de stock mínimo

### 3. Proveedores
- **Entidad**: `Proveedor`
- **Endpoints**: `/proveedores`
- **Permisos**: `CREATE_PROVEEDOR`, `READ_PROVEEDOR`, `UPDATE_PROVEEDOR`, `DELETE_PROVEEDOR`
- **Funcionalidades**:
  - Gestión de proveedores
  - Información de contacto completa
  - Relación con compras

### 4. Clientes
- **Entidad**: `Cliente`
- **Endpoints**: `/clientes`
- **Permisos**: `CREATE_CLIENTE`, `READ_CLIENTE`, `UPDATE_CLIENTE`, `DELETE_CLIENTE`
- **Funcionalidades**:
  - Gestión de clientes
  - Información de contacto completa
  - Relación con ventas

### 5. Compras
- **Entidad**: `Compra`, `DetalleCompra`
- **Endpoints**: `/compras`
- **Permisos**: `CREATE_COMPRA`, `READ_COMPRA`, `DELETE_COMPRA`
- **Funcionalidades**:
  - Registro de compras con detalles
  - Actualización automática de stock al crear compra
  - Transacciones para garantizar integridad
  - Cálculo automático del total
  - Reversión de stock al eliminar compra

### 6. Ventas
- **Entidad**: `Venta`, `DetalleVenta`
- **Endpoints**: `/ventas`
- **Permisos**: `CREATE_VENTA`, `READ_VENTA`, `DELETE_VENTA`
- **Funcionalidades**:
  - Registro de ventas con detalles
  - Validación de stock disponible
  - Actualización automática de stock
  - Múltiples formas de pago (Efectivo, Tarjeta, Transferencia)
  - Cliente opcional
  - Transacciones para garantizar integridad
  - Reversión de stock al eliminar venta

### 7. Arqueos de Caja
- **Entidad**: `ArqueoCaja`
- **Endpoints**: `/arqueos-caja`
- **Permisos**: `CREATE_ARQUEO`, `READ_ARQUEO`, `UPDATE_ARQUEO`, `DELETE_ARQUEO`
- **Funcionalidades**:
  - Registro de arqueos de caja
  - Control de efectivo y tarjeta
  - Cálculo de diferencias

## Estructura de Archivos por Módulo

Cada módulo sigue la siguiente estructura:

```
src/{modulo}/
├── entities/
│   └── {entidad}.entity.ts
├── dto/
│   ├── create-{entidad}.dto.ts
│   └── update-{entidad}.dto.ts
├── {modulo}.controller.ts
├── {modulo}.service.ts
└── {modulo}.module.ts
```

## Características Implementadas

### Seguridad y Autorización
- ✅ Autenticación JWT mediante `@Auth` decorator
- ✅ Control de permisos granular por endpoint
- ✅ Documentación Swagger con `@ApiBearerAuth`

### Validaciones
- ✅ DTOs con decoradores de `class-validator`
- ✅ Validación de tipos con ParseUUIDPipe
- ✅ Validación de stock en ventas
- ✅ Validación de relaciones (categorías, proveedores, clientes)

### Manejo de Errores
- ✅ Manejo centralizado de excepciones
- ✅ Mensajes descriptivos de error
- ✅ Logging de errores con contexto
- ✅ Códigos HTTP apropiados

### Integridad de Datos
- ✅ Transacciones en operaciones complejas (compras y ventas)
- ✅ Rollback automático en caso de error
- ✅ Actualización automática de stock
- ✅ Relaciones consistentes entre entidades

### Paginación
- ✅ Paginación en todos los endpoints de listado
- ✅ Parámetros configurables (limit y offset)
- ✅ Respuesta con metadata (total, páginas)

### Documentación API
- ✅ Swagger/OpenAPI completo
- ✅ Descripción de todos los endpoints
- ✅ Ejemplos de request/response
- ✅ Documentación de códigos de estado

## Endpoints Principales

### Categorías
- `POST /categorias` - Crear categoría
- `GET /categorias` - Listar categorías (paginado)
- `GET /categorias/:id` - Obtener categoría
- `PATCH /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría

### Productos
- `POST /productos` - Crear producto
- `GET /productos` - Listar productos (paginado)
- `GET /productos/:id` - Obtener producto
- `PATCH /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### Proveedores
- `POST /proveedores` - Crear proveedor
- `GET /proveedores` - Listar proveedores (paginado)
- `GET /proveedores/:id` - Obtener proveedor
- `PATCH /proveedores/:id` - Actualizar proveedor
- `DELETE /proveedores/:id` - Eliminar proveedor

### Clientes
- `POST /clientes` - Crear cliente
- `GET /clientes` - Listar clientes (paginado)
- `GET /clientes/:id` - Obtener cliente
- `PATCH /clientes/:id` - Actualizar cliente
- `DELETE /clientes/:id` - Eliminar cliente

### Compras
- `POST /compras` - Registrar compra (con detalles)
- `GET /compras` - Listar compras (paginado)
- `GET /compras/:id` - Obtener compra con detalles
- `DELETE /compras/:id` - Eliminar compra

### Ventas
- `POST /ventas` - Registrar venta (con detalles)
- `GET /ventas` - Listar ventas (paginado)
- `GET /ventas/:id` - Obtener venta con detalles
- `DELETE /ventas/:id` - Eliminar venta

### Arqueos de Caja
- `POST /arqueos-caja` - Crear arqueo
- `GET /arqueos-caja` - Listar arqueos (paginado)
- `GET /arqueos-caja/:id` - Obtener arqueo
- `PATCH /arqueos-caja/:id` - Actualizar arqueo
- `DELETE /arqueos-caja/:id` - Eliminar arqueo

## Ejemplo de Uso

### Crear una Venta

```bash
POST /ventas
Authorization: Bearer {token}
Content-Type: application/json

{
  "clienteId": "uuid-del-cliente", // opcional
  "fechaVenta": "2025-12-18T14:30:00Z",
  "formaPago": "Efectivo",
  "detalles": [
    {
      "productoId": "uuid-del-producto",
      "cantidad": 5,
      "precioUnitario": 1.50
    }
  ]
}
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "fechaVenta": "2025-12-18T14:30:00.000Z",
  "total": 7.50,
  "formaPago": "Efectivo",
  "cliente": { ... },
  "detalles": [ ... ],
  "createdAt": "2025-12-18T14:30:00.000Z"
}
```

## Notas Importantes

1. **Actualización de Stock**: El stock se actualiza automáticamente al crear compras (incrementa) y ventas (decrementa).

2. **Validación de Stock**: Las ventas validan que haya stock suficiente antes de procesar.

3. **Transacciones**: Las operaciones de compras y ventas usan transacciones para garantizar integridad.

4. **Permisos**: Todos los endpoints requieren autenticación y permisos específicos.

5. **Update de Compras/Ventas**: No se permite actualizar compras ni ventas por integridad de datos. Se debe eliminar y crear una nueva.

## Próximos Pasos Sugeridos

1. Crear migración con TypeORM para generar las tablas
2. Agregar permisos al seed de la base de datos
3. Implementar reportes (ventas por periodo, productos más vendidos, etc.)
4. Agregar búsqueda y filtros avanzados
5. Implementar notificaciones de stock mínimo
6. Agregar exportación de datos (PDF, Excel)
