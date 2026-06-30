import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUser = {
  id: string;
  username: string;
  role?: 'super_admin' | 'admin' | 'support';
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): CurrentUser | null => {
  const request = context.switchToHttp().getRequest();
  return request.user ?? null;
});
