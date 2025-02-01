import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ length: 64, default: null, nullable: true })
  first_name: string;

  @Column({ length: 64, default: null, nullable: true })
  last_name: string;

  @Column({ length: 64, default: null, nullable: true })
  username: string;

  @Column({ length: 11, default: null, nullable: true })
  phone: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_banned: boolean;

  @Column()
  updated_at: number;

  @Column()
  joined_at: number;
}
