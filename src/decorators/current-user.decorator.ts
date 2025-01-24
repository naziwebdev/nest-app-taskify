import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//decorator for get currentUser from req (that middleware set it) and in handler parameter give the user
export const currentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
