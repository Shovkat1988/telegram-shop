import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import { GetDataDto } from 'src/dto/get-data.dto';
import { AdminUsersData } from './dto/users-data.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Админ-панель: Пользователи')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка пользователей',
  })
  @ApiResponse({
    status: 200,
    type: AdminUsersData,
    isArray: true,
  })
  @SkipThrottle()
  async getUsers(@Query() query: GetDataDto): Promise<AdminUsersData[]> {
    return await this.usersService.getUsers(query);
  }

  @Post('/admin/:user_id')
  @ApiOperation({
    summary: 'Назначение администратора',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async setAdmin(
    @Param('user_id') user_id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.usersService.setAdmin(user, user_id);
  }

  @Post('/ban/:user_id')
  @ApiOperation({
    summary: 'Бан пользователя',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async banUser(
    @Param('user_id') user_id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.usersService.banUser(user, user_id);
  }

  @Delete('/unban/:user_id')
  @ApiOperation({
    summary: 'Разблокировка пользователя',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async unbanUser(
    @Param('user_id') user_id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.usersService.unbanUser(user, user_id);
  }

  @Delete('/unadmin/:user_id')
  @ApiOperation({
    summary: 'Снятие администратора',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async removeAdmin(
    @Param('user_id') user_id: number,
    @Headers('user') user: UserDataDto,
  ): Promise<boolean> {
    return await this.usersService.removeAdmin(user, user_id);
  }
}
