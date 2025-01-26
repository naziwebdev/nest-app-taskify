import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { User } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(projectData: CreateProjectDto, user: User) {
    try {
      const project = await this.projectsRepository.create(projectData);
      project.creator = user;
      const savedProject = await this.projectsRepository.save(project);

      //exclude passsword from creator
      savedProject.creator = plainToClass(User, savedProject.creator);

      return savedProject;
    } catch (error) {
      throw new InternalServerErrorException('Error create project');
    }
  }

  async getUserProjects(creator: number, limit: number = 2, page: number = 1) {
    try {
      const userProjects = await this.projectsRepository.find({
        where: { creator: { id: creator } },
        take: limit,
        skip: (page - 1) * limit,
      });

      return userProjects;
    } catch (error) {
      throw new InternalServerErrorException('Error get projects');
    }
  }

  async getProjectById(id: number) {
    const project = await this.projectsRepository.findOne({ where: { id } });
    //if use try-catch expetions don't work !!!
    if (!project) {
      throw new NotFoundException('not found project');
    }
    return project;
  }

  async update(projectData: UpdateProjectDto, id: number) {
    const updatedProject = await this.projectsRepository.update(
      id,
      projectData,
    );
    if (updatedProject.affected === 0) {
      throw new NotFoundException('Project not found');
    }
    return this.projectsRepository.findOne({ where: { id } });
  }
}
