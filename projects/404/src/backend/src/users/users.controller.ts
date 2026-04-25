import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { CreateUserDto } from './dto/create-user.dto';
import type { ListUsersQuery } from './dto/list-users.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { ROLE_VALUES, Role } from '../common/types/role.type';
import { UsersService } from './users.service';

const parseNumber = (value?: string) => {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseRole = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const normalized = value.toUpperCase();
  return ROLE_VALUES.includes(normalized as Role)
    ? (normalized as Role)
    : undefined;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    const filters: ListUsersQuery = {
      page: parseNumber(query.page),
      pageSize: parseNumber(query.pageSize),
      name: query.name,
      email: query.email,
      role: parseRole(query.role),
    };
    return this.usersService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
