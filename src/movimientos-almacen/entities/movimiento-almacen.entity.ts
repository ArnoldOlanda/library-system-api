import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Producto } from '../../productos/entities/producto.entity';
import { User } from '../../users/entities/user.entity';

export enum TipoMovimiento {
  ENTRADA = 'Entrada',
  SALIDA = 'Salida',
  AJUSTE_ENTRADA = 'Ajuste Entrada',
  AJUSTE_SALIDA = 'Ajuste Salida',
}

export enum OrigenMovimiento {
  COMPRA = 'Compra',
  VENTA = 'Venta',
  AJUSTE_MANUAL = 'Ajuste Manual',
  DEVOLUCION_COMPRA = 'Devolución Compra',
  DEVOLUCION_VENTA = 'Devolución Venta',
}

@Entity('movimientos_almacen')
export class MovimientoAlmacen {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'enum', enum: TipoMovimiento })
  tipoMovimiento: TipoMovimiento;

  @Column({ type: 'enum', enum: OrigenMovimiento })
  origenMovimiento: OrigenMovimiento;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'int' })
  stockAnterior: number;

  @Column({ type: 'int' })
  stockNuevo: number;

  @Column({ type: 'uuid', nullable: true })
  referenciaId: string; // ID de la compra, venta u otro documento

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ type: 'timestamp' })
  fechaMovimiento: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @BeforeInsert()
  asignUuid() {
    this.id = uuid();
  }
}
