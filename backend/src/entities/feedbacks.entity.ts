import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('feedbacks')
export class Feedbacks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ default: null, nullable: true })
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'replied_by' })
  replied_by: number;

  @Column({ length: 4096 })
  message: string;

  @Column({ length: 4096, nullable: true, default: null })
  reply: string;

  @Column({ default: false })
  is_replied: boolean;

  @Column()
  created_at: number;
}
