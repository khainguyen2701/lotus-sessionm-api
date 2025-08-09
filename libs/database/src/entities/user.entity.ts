import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: '100', nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', default: 'reviewing' })
  status: string;

  @UpdateDateColumn({ type: 'timestamp' })
  last_login: Date;

  @Column({ type: 'varchar', nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];
}
