import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { Session } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(
    @Body() body: CreateUserDto,
    @Session() session: any,
    @Res() res: Response,
  ) {
    const newUser = await this.usersService.register(body);

    session.userId = newUser.id;

    return res.status(HttpStatus.CREATED).json({
      data: newUser,
      statusCode: HttpStatus.CREATED,
      message: 'user created successfully',
    });
  }
}
