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
  async getUserProjects(@Res() res: Response) {}

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getOneProject(@Param('id') id: string, @Res() res: Response) {}

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
