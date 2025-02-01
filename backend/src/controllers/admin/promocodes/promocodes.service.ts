import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Promocodes } from 'src/entities/promocodes.entity';
import { Repository } from 'typeorm';
import { PromocodesDataDto } from './dto/promocodes-data.dto';
import { AdminPromocodesBody } from './dto/promocodes-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { UserDataDto } from 'src/dto/user-data.dto';
import { PromocodesActivations } from 'src/entities/promocodes-activations.entity';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectRepository(Promocodes)
    private readonly promocodesRepository: Repository<Promocodes>,

    @InjectRepository(PromocodesActivations)
    private readonly promocodesActivationsRepository: Repository<PromocodesActivations>,
  ) {}

  async getPromocodes(query: GetDataDto): Promise<PromocodesDataDto[]> {
    const promocodes = await this.promocodesRepository
      .createQueryBuilder('promocodes')
      .select([
        'promocodes.id as id',
        'promocodes.code as code',
        'promocodes.activations_left as activations_left',
        'promocodes.discount as discount',
        'promocodes.created_at as created_at',
      ])
      .limit(query?.limit || 50)
      .offset(query?.offset || 0)
      .getRawMany();

    return promocodes;
  }

  async createPromocode(
    body: AdminPromocodesBody,
    user: UserDataDto,
  ): Promise<CreateDataDto> {
    const findPromocode = await this.promocodesRepository
      .createQueryBuilder('promocodes')
      .select(['promocodes.id as id'])
      .where('code = :code', { code: body.code })
      .getRawOne();

    if (findPromocode) errorGenerator(Errors.ALREADY_EXISTS);

    const timestamp = getCurrentTimestamp();

    const insertAction = await this.promocodesRepository
      .createQueryBuilder()
      .insert()
      .into(Promocodes)
      .values({
        code: body.code,
        created_by: user.id,
        activations_left: body.activations_left,
        discount: body.discount,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .execute();

    return { id: insertAction.identifiers[0].id, updated_at: timestamp };
  }

  async deletePromocode(id: number): Promise<boolean> {
    const findPromocode = await this.promocodesRepository
      .createQueryBuilder('promocodes')
      .select(['promocodes.id as id'])
      .where('id = :id', { id })
      .getRawOne();

    if (!findPromocode) errorGenerator(Errors.NOT_FOUND);

    await this.promocodesActivationsRepository
      .createQueryBuilder()
      .delete()
      .from(PromocodesActivations)
      .where('promocode_id = :id', { id })
      .execute();

    await this.promocodesRepository
      .createQueryBuilder()
      .delete()
      .from(Promocodes)
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
