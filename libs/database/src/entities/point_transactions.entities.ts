import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';

@Entity('point_transactions')
export class PointTransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['earn', 'spend'],
  })
  transaction_type: 'earn' | 'spend' | 'other';

  @Column({
    type: 'int',
    default: 0,
  })
  points: number;

  @Column({
    type: 'varchar',
    default: '',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: ['internal', 'lotus'],
    default: 'internal',
  })
  transaction_source: 'internal' | 'lotus';

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transaction_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UsersEntity, (user) => user.point_transactions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column({
    type: 'enum',
    enum: ['rejected', 'pending', 'processed'],
    default: 'pending',
    nullable: true,
  })
  status: 'rejected' | 'pending' | 'processed';
}
