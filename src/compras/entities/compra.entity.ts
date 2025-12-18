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
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';

@Entity('compras')
export class Compra {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => Proveedor, proveedor => proveedor.compras, {
    nullable: false,
  })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column({ type: 'timestamp' })
  fechaCompra: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => DetalleCompra, detalleCompra => detalleCompra.compra, {
    cascade: true,
  })
  detalles: DetalleCompra[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  asignUuid() {
    this.id = uuid();
  }
}
