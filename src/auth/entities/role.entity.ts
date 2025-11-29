import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Role {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ unique: true })
    name: string;

	@Column({ nullable: true })
	description?: string;

    @Column({ nullable: true })
    otherField: string;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @BeforeInsert()
    asignUuid() {
        this.id = uuid();
    }
}
