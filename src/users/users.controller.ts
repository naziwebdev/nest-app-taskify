import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { Session } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './user.entity';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from 'src/guards/auth.guard';

//middleware => just set user on req
//decorator => get user data in handler paramter
//authorization & authentication => guard (get user from req)

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

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Session() session: any,
    @Res() res: Response,
  ) {
    const user = await this.usersService.login(body);
    session.userId = user.id;

    return res.status(HttpStatus.OK).json({
      data: user,
      statusCode: HttpStatus.OK,
      message: 'user login successfully',
    });
  }

  @Get('/me')
  //authGuard is for if user was not login dont access from this route
  @UseGuards(AuthGuard)
  //currentUser is decoretor for get user from req
  //if in handler need to user data that is login we must use decorator and dont can get user data from authGuard
  getMe(@CurrentUser() user: User, @Res() res: Response) {
    //custom response and remove password from user with plainToClass
    const mainUser = plainToClass(User, user);
    return res.status(HttpStatus.OK).json({
      data: mainUser,
      statusCode: HttpStatus.OK,
      message: 'user data send successfully',
    });
  }
}
