import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssignmentsModule } from './task-assignments/task-assignments.module';

@Module({
  imports: [UsersModule, ProjectsModule, TasksModule, TaskAssignmentsModule],
})
export class AppModule {}
