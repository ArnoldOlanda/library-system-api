import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/validRoles.enum';
import { Permission } from 'src/auth/enums/permissions.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth({permissions: [Permission.CREATE_USER]})
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth({permissions:[Permission.READ_USER]})
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
    
  }

  @Auth({roles: [Role.ADMIN]})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
    
  }

  @Auth({roles: [Role.ADMIN]})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);

    
  }

  @Auth({roles: [Role.ADMIN]})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
    
  }

  @Auth({permissions: [Permission.UPDATE_USER]})
  @Post(':id/roles')
  assignRoles(
    @Param('id') id: string,
    @Body('roleId', ParseUUIDPipe) role: string,
  ) {
    return this.usersService.assignRole(id, role);
  }
}
