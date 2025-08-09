import { SetMetadata } from '@nestjs/common';
import { RoleBaseAccessControl, ROLES_KEY } from '../constant/index.constant';

export const Roles = (...roles: RoleBaseAccessControl[]) =>
  SetMetadata(ROLES_KEY, roles);
