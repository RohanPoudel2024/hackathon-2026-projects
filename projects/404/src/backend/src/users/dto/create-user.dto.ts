import { Role } from '../../common/types/role.type';

export type CreateUserDto = {
  fullName: string;
  email: string;
  password: string;
  role: Role;
};
