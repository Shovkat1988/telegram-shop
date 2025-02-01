import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { PromocodesActivations } from 'src/entities/promocodes-activations.entity';
import { Promocodes } from 'src/entities/promocodes.entity';
import Errors from 'src/errors.enum';
import errorGenerator from 'src/utils/errorGenerator.utils';
import { Repository } from 'typeorm';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectRepository(Promocodes)
    private readonly promocodesRepository: Repository<Promocodes>,

    @InjectRepository(PromocodesActivations)
    private readonly promocodesActivationsRepository: Repository<PromocodesActivations>,
  ) {}

  async getPromocode(user: UserDataDto, promocode: string): Promise<number> {
    const findPromocode = await this.promocodesRepository
      .createQueryBuilder('promocodes')
      .select([
        'promocodes.id as id',
        'promocodes.activations_left as activations_left',
        'promocodes.discount as discount',
      ])
      .where('code = :code', { code: promocode })
      .getRawOne();

    if (!findPromocode) errorGenerator(Errors.NOT_FOUND);

    const findActivation = await this.promocodesActivationsRepository
      .createQueryBuilder('promocodes_activations')
      .select(['promocodes_activations.id as id'])
      .where('promocode_id = :promocode_id', { promocode_id: findPromocode.id })
      .andWhere('activated_by = :user_id', { user_id: user.id })
      .getRawOne();

    if (findActivation) errorGenerator(Errors.ALREADY_ACTIVATED);

    return +findPromocode.discount;
  }
}
