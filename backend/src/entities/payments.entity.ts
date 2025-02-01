import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('payments')
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column()
  metadata: string;

  @Column()
  amount: number;

  @Column({ default: false })
  completed: boolean;

  @Column()
  valid_until: number;

  @Column()
  created_at: number;
}
