import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ length: 8192 })
  items: string;

  @Column({ length: 128 })
  full_name: string;

  @Column({ length: 128 })
  address: string;

  @Column({ length: 11 })
  phone: string;

  @Column({ length: 128, default: null, nullable: true })
  comment: string;

  @Column({ default: 0 })
  previous_amount: number;

  @Column({ default: 0 })
  payment_type: number;

  @Column({ default: 0 })
  change_from: number;

  @Column()
  amount: number;

  @Column({ default: 0 })
  status: number;

  @Column()
  created_at: number;
}
