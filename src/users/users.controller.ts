import { UsersService } from './users.service';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
  @Post('/update')
  updateUser(@Body() body: any) {
    return this.usersService.update(1, { email: '무야야야홍' });
  }
}
