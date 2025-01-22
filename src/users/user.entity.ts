import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { RoleUserEnum } from './enums/roleUserEnum';
import {Project} from '../projects/project.entity'

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

  @OneToMany(() => Project , (project)=>project.creator)
  projects:Project[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
