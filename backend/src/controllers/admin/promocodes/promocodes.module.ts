import { Module } from '@nestjs/common';
import { PromocodesController } from './promocodes.controller';
import { PromocodesService } from './promocodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocodes } from 'src/entities/promocodes.entity';
import { PromocodesActivations } from 'src/entities/promocodes-activations.entity';

@Module({
  controllers: [PromocodesController],
  providers: [PromocodesService],
  imports: [TypeOrmModule.forFeature([Promocodes, PromocodesActivations])],
})
export class PromocodesModule {}
