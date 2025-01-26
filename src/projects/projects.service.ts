import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { User } from 'src/users/user.entity';
import { plainToClass, instanceToPlain } from 'class-transformer';

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
}
