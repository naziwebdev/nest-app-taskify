import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { RoleUserEnum } from './enums/roleUserEnum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: RoleUserEnum,
    default: RoleUserEnum.USER,
    nullable: false,
  })
  role: RoleUserEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
