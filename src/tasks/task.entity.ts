import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TasStatusEnum } from './enums/taskStatusEnum';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TasStatusEnum,
    default: TasStatusEnum.PENDDING,
    nullable: false,
  })
  status: TasStatusEnum;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deadline: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { nullable: false })
  project: Project;

  @ManyToMany(() => User, (user) => user.tasks)
  users: User[];

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
