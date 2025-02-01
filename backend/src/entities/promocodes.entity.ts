import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('promocodes')
export class Promocodes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ length: 128, unique: true })
  code: string;

  @Column()
  activations_left: number;

  @Column()
  discount: number;

  @Column()
  updated_at: number;

  @Column()
  created_at: number;
}
