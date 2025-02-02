import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Response } from 'express';
import { User } from 'src/users/user.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() body: CreateTaskDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    //check that task creator be project creator
    await this.tasksService.isCreatorOfProject(body.projectId, user.id);
    const task = await this.tasksService.create(body);
    return res.status(HttpStatus.CREATED).json({
      data: task,
      statusCode: HttpStatus.CREATED,
      message: 'task created successfully',
    });
  }

  @Get('/:project_id/tasks')
  @UseGuards(AuthGuard)
  async getAll(
    @Param('project_id') projectId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.tasksService.isCreatorOfProject(parseInt(projectId), user.id);

    const tasks = await this.tasksService.getProjectTasks(
      parseInt(projectId),
      parseInt(limit),
      parseInt(page),
    );

    return res.status(HttpStatus.OK).json({
      data: tasks,
      statusCode: HttpStatus.OK,
      message: 'tasks find successfully',
    });
  }

  @Get('/:task_id')
  @UseGuards(AuthGuard)
  async getOne(
    @Param('task_id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.tasksService.isOwnTask(user.id, parseInt(id));
    const task = await this.tasksService.getOneTask(parseInt(id));
    return res.status(HttpStatus.OK).json({
      data: task,
      statusCode: HttpStatus.OK,
      message: 'task find successfully',
    });
  }

  @Put('/:task_id')
  @UseGuards(AuthGuard)
  async update(
    @Param('task_id') id: string,
    @Body() body: UpdateTaskDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.tasksService.isCreatorOfProject(body.projectId, user.id);
    const updatedTask = await this.tasksService.updateTask(parseInt(id), body);
    return res.status(HttpStatus.OK).json({
      data: updatedTask,
      statusCode: HttpStatus.OK,
      message: 'task updated successfully',
    });
  }

  @Patch('/:task_id/status')
  @UseGuards(AuthGuard)
  async updateStatusTask(
    @Param('task_id') id: string,
    @Body() body: UpdateTaskStatusDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    await this.tasksService.isOwnTask(user.id, parseInt(id));
    const updatedTaskStatus = await this.tasksService.updateStatus(
      parseInt(id),
      body.status,
    );
    return res.status(HttpStatus.OK).json({
      data: updatedTaskStatus,
      statusCode: HttpStatus.OK,
      message: 'status task updated successfully',
    });
  }

  @Delete('/:task_id')
  @UseGuards(AuthGuard)
  async remove(
    @Param('task_id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const task = await this.tasksService.getOneTask(parseInt(id));
    if (!task) {
      throw new NotFoundException('not found task');
    }

    await this.tasksService.isCreatorOfProject(task.project.id, user.id);

    await this.tasksService.removeTask(parseInt(id));
    return res.status(HttpStatus.OK).json({
      data: null,
      statusCode: HttpStatus.OK,
      message: 'task removed successfully',
    });
  }
}
