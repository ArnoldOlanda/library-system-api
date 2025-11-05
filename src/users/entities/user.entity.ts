import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import { ValidRole } from "src/auth/enums/validRoles.enum";

@Entity('users')
export class User {
    @PrimaryColumn({type: 'uuid'})
    id: string;

    @Column({type: 'varchar', length: 100})
    name: string;

    @Column({type: 'varchar', length: 100, unique: true})
    email: string;

    @Column({type: 'varchar', nullable: true})
    avatar: string | null;

    @Column({type: 'varchar'})
    password: string;

    @Column({type: 'enum', enum: ValidRole, default: ValidRole.USER})
    role: ValidRole;

    @Column({type: 'boolean', default: true})
    isActive: boolean;

    @Column({type: 'boolean', default: false})
    isSocialLogin: boolean;

    @Column({type: 'varchar', nullable: true})
    socialProvider: string;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deletedAt: Date | null;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @BeforeInsert()
    asignUuid(){
        this.id = uuid();
    }
}
