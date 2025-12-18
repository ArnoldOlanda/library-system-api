import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Compra } from './compra.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_compras')
export class DetalleCompra {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ManyToOne(() => Compra, compra => compra.detalles, { nullable: false })
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  @ManyToOne(() => Producto, producto => producto.detallesCompra, {
    nullable: false,
  })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @BeforeInsert()
  asignUuid() {
    this.id = uuid();
  }
}
