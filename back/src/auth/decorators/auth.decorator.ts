import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwTAuthGuard } from '../guards/jwt.guard';
import { OnlyAdminGuard } from '../guards/admin.guard';

export const Auth = (role: Role = Role.USER) => {
  if (role === Role.ADMIN) {
    return applyDecorators(UseGuards(JwTAuthGuard, OnlyAdminGuard));
  }
  return applyDecorators(UseGuards(JwTAuthGuard));
};
