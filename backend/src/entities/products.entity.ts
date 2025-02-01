import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Uploads } from './uploads.entity';
import { Categories } from './categories.entity';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ length: 128 })
  title: string;

  @Column({ length: 128 })
  description: string;

  @Column()
  @ManyToOne(() => Categories, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category_id: number;

  @Column()
  @ManyToOne(() => Uploads, (upload) => upload.id)
  @JoinColumn({ name: 'image_id' })
  image_id: number;

  @Column()
  sell_price: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column()
  position: number;

  @Column()
  updated_at: number;

  @Column()
  created_at: number;
}
