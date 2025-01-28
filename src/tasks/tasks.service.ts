import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async isCreatorOfProject(projectId: number, userId: number) {
    const creator = await this.projectRepository.findOne({
      where: { creator: { id: userId }, id: projectId },
    });

    if (!creator) {
      throw new UnauthorizedException('you forbidden access from this route');
    }
  }

  async isOwnTask(userId: number, taskId: number) {
    const task = await this.tasksRepository
      .createQueryBuilder('tasks')
      .innerJoinAndSelect('tasks.users', 'users')
      .where('tasks.id = :taskId', { taskId })
      .andWhere('users.id = :userId', { userId })
      .getOne();

    if (!task) {
      throw new NotFoundException(
        'Task not found or user not associated with task',
      );
    }

    return task;
  }

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
    //m:m relation creating raw
    task.users = users;

    const savedTask = await this.tasksRepository.save(task);
    savedTask.users = plainToInstance(User, savedTask.users);

    return savedTask;
  }

  async getProjectTasks(projectId: number, limit: number, page: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('not found project');
    }

    const tasks = await this.tasksRepository.find({
      where: { project: project },
      relations: ['users'],
      take: limit,
      skip: (page - 1) * limit,
    });

    // Transform users to exclude password
    const transformedTasks = tasks.map((task) => {
      task.users = plainToInstance(User, task.users);
      return task;
    });

    return transformedTasks;
  }

  async getOneTask(id: number) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!task) {
      throw new NotFoundException('not found task');
    }
    task.users = plainToInstance(User, task.users);

    return task;
  }

  async updateTask(id: number, taskData: UpdateTaskDto) {
    const { usersId, projectId, ...taskFields } = taskData;

    let project = null;
    if (projectId) {
      project = await this.projectRepository.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('not found project');
      }
    }

    let users = [];
    if (usersId && usersId.length > 0) {
      users = await this.userRepository.find({
        where: usersId.map((id) => ({ id })),
      });

      if (usersId.length !== users.length) {
        throw new NotFoundException('one or more user not found');
      }
    }

    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['users', 'project'],
    });

    if (!task) {
      throw new NotFoundException('not found task');
    }

    Object.assign(task, taskFields);

    if (project) {
      task.project = project;
    }

    if (users.length > 0) {
      task.users = users;
    }

    const updatedTask = await this.tasksRepository.save(task);
    updatedTask.users = plainToInstance(User, updatedTask.users);

    return updatedTask;
  }
}
