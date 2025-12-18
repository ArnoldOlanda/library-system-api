import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('arqueos_caja')
export class ArqueoCaja {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'timestamp' })
  fechaArqueo: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoInicial: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalRecaudado: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalEfectivo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalTarjeta: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  diferencia: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  asignUuid() {
    this.id = uuid();
  }
}
