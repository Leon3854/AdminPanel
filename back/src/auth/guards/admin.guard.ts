import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('You do not have rights!');
    }
    return true;
  }
}
