import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Users } from 'src/entities/users.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Repository } from 'typeorm';
import { AdminUsersData } from './dto/users-data.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUsers(query: GetDataDto): Promise<AdminUsersData[]> {
    const users = await this.usersRepository
      .createQueryBuilder('users')
      .select([
        'users.id as id',
        'users.user_id as user_id',
        'users.first_name as first_name',
        'users.last_name as last_name',
        'users.username as username',
        'users.is_admin as is_admin',
        'users.joined_at as joined_at',
      ])
      .offset(query?.offset || 0)
      .limit(query?.limit || 50)
      .orderBy('users.joined_at', 'DESC')
      .getRawMany();

    return users;
  }

  async banUser(user: UserDataDto, user_id: number): Promise<boolean> {
    if (user.user_id === user_id) errorGenerator(Errors.BAD_REQUEST);

    const findUser = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id as id', 'users.is_banned as is_banned'])
      .where('users.user_id = :user_id', { user_id })
      .getRawOne();

    if (!findUser) errorGenerator(Errors.NOT_FOUND);

    if (findUser.is_banned) errorGenerator(Errors.ALREADY_BANNED);

    await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({ is_banned: true, updated_at: getCurrentTimestamp() })
      .where('id = :id', { id: findUser.id })
      .execute();

    return true;
  }

  async setAdmin(user: UserDataDto, user_id: number): Promise<boolean> {
    if (user.user_id === user_id) errorGenerator(Errors.BAD_REQUEST);

    const findUser = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id as id', 'users.is_admin as is_admin'])
      .where('users.user_id = :user_id', { user_id })
      .getRawOne();

    if (!findUser) errorGenerator(Errors.NOT_FOUND);

    if (findUser.is_admin) errorGenerator(Errors.ALREADY_ADMIN);

    await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({ is_admin: true, updated_at: getCurrentTimestamp() })
      .where('id = :id', { id: findUser.id })
      .execute();

    return true;
  }

  async unbanUser(user: UserDataDto, user_id: number): Promise<boolean> {
    if (user.user_id === user_id) errorGenerator(Errors.BAD_REQUEST);

    const findUser = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id as id', 'users.is_banned as is_banned'])
      .where('users.user_id = :user_id', { user_id })
      .getRawOne();

    if (!findUser) errorGenerator(Errors.NOT_FOUND);

    if (!findUser.is_banned) errorGenerator(Errors.ALREADY_UNBANNED);

    await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({ is_banned: false, updated_at: getCurrentTimestamp() })
      .where('id = :id', { id: findUser.id })
      .execute();

    return true;
  }

  async removeAdmin(user: UserDataDto, user_id: number): Promise<boolean> {
    if (user.user_id === user_id) errorGenerator(Errors.BAD_REQUEST);

    const findUser = await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id as id', 'users.is_admin as is_admin'])
      .where('users.user_id = :user_id', { user_id })
      .getRawOne();

    if (!findUser) errorGenerator(Errors.NOT_FOUND);

    if (!findUser.is_admin) errorGenerator(Errors.ALREADY_ADMIN);

    await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({ is_admin: false, updated_at: getCurrentTimestamp() })
      .where('id = :id', { id: findUser.id })
      .execute();

    return true;
  }
}
