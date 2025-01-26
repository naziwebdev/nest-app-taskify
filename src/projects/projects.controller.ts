import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Res,
  Body,
  UseGuards,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() body: CreateProjectDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const project = await this.projectsService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: project,
      statusCode: HttpStatus.CREATED,
      message: 'project created successfully',
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserProjects(
    @CurrentUser() user: User,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Res() res: Response,
  ) {
    const userProjects = await this.projectsService.getUserProjects(
      user.id,
      parseInt(limit),
      parseInt(page),
    );
    return res.status(HttpStatus.OK).json({
      data: userProjects,
      statusCode: HttpStatus.OK,
      message: 'userProject sent  successfully',
    });
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getOneProject(@Param('id') id: string, @Res() res: Response) {
    const project = await this.projectsService.getProjectById(parseInt(id));

    return res.status(HttpStatus.OK).json({
      data: project,
      statusCode: HttpStatus.OK,
      message: 'project sent  successfully',
    });
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
    @Res() res: Response,
  ) {}

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Res() res: Response) {}
}
