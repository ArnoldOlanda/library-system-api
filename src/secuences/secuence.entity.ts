import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('sequences')
export class Sequence {

  @PrimaryColumn({ type: 'uuid' })
    id: string;

  @Column({ name: 'document_type', type: 'varchar', length: 50, unique: true })
  documentType: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  prefix: string;

  @Column({ name: 'current_number', type: 'int', default: 0 })
  currentNumber: number;

  @Column({ type: 'int', default: 8 })
  padding: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}