import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

//this just set user on req ... after with custom decorator get user from req
//for set user on req must use middleware and for roleGuard must use Gaurd beacuse middleware execute before Gurad

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findById(userId);
      req.currentUser = user;
    }

    next();
  }
}
