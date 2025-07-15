import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from 'src/auth/guards/authorized.guard'
import { Authorization } from 'src/auth/decorators/auth.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string){
    return this.userService.findeById(userId)
  }
}
