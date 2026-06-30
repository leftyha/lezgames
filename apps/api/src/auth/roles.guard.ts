import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

const ROLE_WEIGHT: Record<AdminRole, number> = { support: 1, admin: 2, super_admin: 3 };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role as AdminRole | undefined;
    if (!userRole) throw new ForbiddenException('Admin role required.');

    const requiredWeight = Math.min(...requiredRoles.map((role) => ROLE_WEIGHT[role]));
    if (ROLE_WEIGHT[userRole] < requiredWeight) throw new ForbiddenException('Insufficient permissions.');
    return true;
  }
}
