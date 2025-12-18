import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { DetalleVenta } from './detalle-venta.entity';

export enum FormaPago {
  EFECTIVO = 'Efectivo',
  TARJETA = 'Tarjeta',
  TRANSFERENCIA = 'Transferencia',
}

@Entity('ventas')
export class Venta {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => Cliente, cliente => cliente.ventas, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente|null;

  @Column({ type: 'timestamp' })
  fechaVenta: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: FormaPago, default: FormaPago.EFECTIVO })
  formaPago: FormaPago;

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.venta, {
    cascade: true,
  })
  detalles: DetalleVenta[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  asignUuid() {
    this.id = uuid();
  }
}
