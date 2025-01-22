import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { RoleUserEnum } from './enums/roleUserEnum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RoleUserEnum, default: RoleUserEnum.USER })
  role: RoleUserEnum;
  
  @CreateDateColumn()
  created_at: Date;
}
