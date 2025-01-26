import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { TasStatusEnum } from './enums/taskStatusEnum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TasksService {
  //for use project & user repo in task DI we must put them in task.module.ts
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(taskData: CreateTaskDto) {
    const userIds = taskData.usersId;
    const project = await this.projectRepository.findOne({
      where: { id: taskData.projectId },
    });

    if (!project) {
      throw new NotFoundException('not found project');
    }

    const users = await this.userRepository.find({
      where: userIds.map((id) => ({ id })),
    });

    if (users.length !== userIds.length) {
      throw new NotFoundException('one or more user not found');
    }

    const task = await this.tasksRepository.create({
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      status: TasStatusEnum.PENDDING,
    });

    task.project = project;
    task.users = users;

    const savedTask = await this.tasksRepository.save(task);
    savedTask.users = plainToInstance(User, savedTask.users);

    return savedTask;
  }
}
