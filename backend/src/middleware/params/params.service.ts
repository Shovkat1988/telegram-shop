import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Users } from 'src/entities/users.entity';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Repository } from 'typeorm';

@Injectable()
export class ParamsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUser(userData: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  }): Promise<UserDataDto> {
    let user = await this.usersRepository
      .createQueryBuilder('users')
      .select(['*'])
      .where('users.user_id = :user_id', { user_id: userData.id })
      .getRawOne();

    const first_name = userData?.first_name || null;
    const last_name = userData?.last_name || null;
    const username = userData?.username || null;

    if (!user || user.updated_at < getCurrentTimestamp()) {
      if (!user) {
        const values = {
          user_id: userData.id,
          first_name,
          last_name,
          username,
          updated_at: getCurrentTimestamp() + 86400,
          joined_at: getCurrentTimestamp(),
        };

        const insertAction = await this.usersRepository
          .createQueryBuilder()
          .insert()
          .into(Users)
          .values(values)
          .execute();

        user = {
          ...values,
          id: insertAction.identifiers[0].id,
        };
      } else {
        await this.usersRepository
          .createQueryBuilder()
          .update(Users)
          .set({
            updated_at: getCurrentTimestamp() + 86400,
            first_name,
            last_name,
            username,
          })
          .where('user_id = :user_id', { user_id: userData.id })
          .execute();

        user = {
          ...user,
          first_name,
          last_name,
          username,
        };
      }
    }

    return user;
  }
}
