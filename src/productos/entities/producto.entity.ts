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
import { Categoria } from '../../categorias/entities/categoria.entity';
import { DetalleCompra } from '../../compras/entities/detalle-compra.entity';
import { DetalleVenta } from '../../ventas/entities/detalle-venta.entity';

@Entity('productos')
export class Producto {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @ManyToOne(() => Categoria, categoria => categoria.productos, {
    nullable: false,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioCompra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  stockMinimo: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @OneToMany(() => DetalleCompra, detalleCompra => detalleCompra.producto)
  detallesCompra: DetalleCompra[];

  @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.producto)
  detallesVenta: DetalleVenta[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  asignUuid() {
    this.id = uuid();
  }
}
