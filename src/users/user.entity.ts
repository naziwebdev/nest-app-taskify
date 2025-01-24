import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleUserEnum } from './enums/roleUserEnum';
import { Project } from '../projects/project.entity';
import { Task } from 'src/tasks/task.entity';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleUserEnum,
    default: RoleUserEnum.USER,
    nullable: false,
  })
  role: RoleUserEnum;

  @OneToMany(() => Project, (project) => project.creator)
  projects: Project[];

  @ManyToMany(() => Task, (task) => task.users)
  @JoinTable()
  tasks: Task[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @CreateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
