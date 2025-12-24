# Integración de Movimientos de Almacén

## Instrucciones para integrar en Compras y Ventas

### En ComprasService (compras/compras.service.ts)

Inyectar el servicio de movimientos en el constructor:

```typescript
constructor(
  @InjectRepository(Compra)
  private readonly compraRepository: Repository<Compra>,
  @InjectRepository(Producto)
  private readonly productoRepository: Repository<Producto>,
  private readonly movimientosAlmacenService: MovimientosAlmacenService,
) {}
```

Al crear una compra, registrar los movimientos:

```typescript
async create(createCompraDto: CreateCompraDto, user: User) {
  // ... código existente para crear la compra ...

  // Registrar movimientos de almacén para cada detalle
  for (const detalle of savedCompra.detalles) {
    await this.movimientosAlmacenService.create(
      {
        productoId: detalle.producto.id,
        tipoMovimiento: TipoMovimiento.ENTRADA,
        origenMovimiento: OrigenMovimiento.COMPRA,
        cantidad: detalle.cantidad,
        referenciaId: savedCompra.id,
        observaciones: `Compra #${savedCompra.id} - Proveedor: ${savedCompra.proveedor.nombre}`,
      },
      user,
    );
  }

  return savedCompra;
}
```

### En VentasService (ventas/ventas.service.ts)

Similar al servicio de compras:

```typescript
constructor(
  @InjectRepository(Venta)
  private readonly ventaRepository: Repository<Venta>,
  @InjectRepository(Producto)
  private readonly productoRepository: Repository<Producto>,
  private readonly movimientosAlmacenService: MovimientosAlmacenService,
) {}
```

Al crear una venta, registrar los movimientos:

```typescript
async create(createVentaDto: CreateVentaDto, user: User) {
  // ... código existente para crear la venta ...

  // Registrar movimientos de almacén para cada detalle
  for (const detalle of savedVenta.detalles) {
    await this.movimientosAlmacenService.create(
      {
        productoId: detalle.producto.id,
        tipoMovimiento: TipoMovimiento.SALIDA,
        origenMovimiento: OrigenMovimiento.VENTA,
        cantidad: detalle.cantidad,
        referenciaId: savedVenta.id,
        observaciones: `Venta #${savedVenta.id}${savedVenta.cliente ? ` - Cliente: ${savedVenta.cliente.nombre}` : ''}`,
      },
      user,
    );
  }

  return savedVenta;
}
```

### Importar el módulo

En compras.module.ts y ventas.module.ts:

```typescript
imports: [
  TypeOrmModule.forFeature([Compra, DetalleCompra, Producto]),
  MovimientosAlmacenModule, // Agregar esta línea
  AuthModule,
],
```

### Ventajas de este enfoque:

1. **Trazabilidad completa**: Cada movimiento queda registrado con fecha, usuario y referencia
2. **Auditoría**: Los movimientos no se pueden editar ni eliminar, son inmutables
3. **Stock automático**: El stock se actualiza automáticamente al registrar el movimiento
4. **Historial por producto**: Puedes ver todo el historial de un producto
5. **Consultas por referencia**: Puedes ver todos los movimientos de una compra/venta específica
6. **Ajustes manuales**: También permite registrar ajustes de inventario con observaciones
