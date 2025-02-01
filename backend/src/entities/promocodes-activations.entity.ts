import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Promocodes } from './promocodes.entity';

@Entity('promocodes_activations')
export class PromocodesActivations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  activated_by: number;

  @Column()
  @ManyToOne(() => Promocodes, (promocode) => promocode.id)
  @JoinColumn({ name: 'promocode_id' })
  promocode_id: number;

  @Column()
  activated_at: number;
}
