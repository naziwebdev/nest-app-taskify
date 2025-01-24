import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { RoleUserEnum } from './enums/roleUserEnum';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async checkUserExist(email: string, phone: string) {
    const user = await this.usersRepository.findOne({
      where: [{ email }, { phone }],
    });

    return user;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  private async createUser(
    userData: CreateUserDto,
    hashedPassword: string,
    usersCount,
  ) {
    const newUser = await this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      role: usersCount > 0 ? RoleUserEnum.USER : RoleUserEnum.ADMIN,
    });

    return newUser;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('not found user');
    }
    return user;
  }

  async register(userData: CreateUserDto) {
    try {
      const user = await this.checkUserExist(userData.email, userData.phone);
      if (user) {
        throw new ConflictException('user already registered');
      }

      const usersCount = await this.usersRepository.count();

      const hashedPassword = await this.hashPassword(userData.password);

      const newUser = await this.createUser(
        userData,
        hashedPassword,
        usersCount,
      );

      return this.usersRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(userData: LoginDto) {
    try {
      const user = await this.checkUserExist(userData.email, userData.phone);
      if (!user) {
        throw new NotFoundException('not found user');
      }

      const validPassword = await bcrypt.compare(
        userData.password,
        user.password,
      );
      if (!validPassword) {
        throw new BadRequestException('invalid email | phone | password');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
