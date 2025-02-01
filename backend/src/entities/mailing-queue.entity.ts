import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Uploads } from './uploads.entity';

@Entity('mailing_queue')
export class MailingQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 4096, default: null, nullable: true })
  text: string;

  @Column({ default: null, nullable: true })
  @ManyToOne(() => Uploads, (uploads) => uploads.id)
  @JoinColumn({ name: 'image_id' })
  image_id: number;

  @Column()
  created_at: number;
}
