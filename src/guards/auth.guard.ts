import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

//for prevent that user can't access to my routes if is not login
//this can't give me user data in handler and just forbidden to access route
//for get user data that is login we need use decortor that get user from req
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
