import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Products } from './products.entity';

@Entity('products_options')
export class ProductsOptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column()
  @ManyToOne(() => Products, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product_id: number;

  @Column({ length: 128 })
  title: string;

  @Column()
  sell_price: number;

  @Column()
  updated_at: number;

  @Column()
  created_at: number;
}
