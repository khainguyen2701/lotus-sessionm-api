import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';
import { SyncLogEntity } from './sync_log.entities';

@Entity('point_transactions')
export class PointTransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['earn', 'spend'],
  })
  transaction_type: 'earn' | 'spend';

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

  @OneToOne(() => SyncLogEntity, (syncLog) => syncLog.point_transaction, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'sync_log_id' })
  sync_log: SyncLogEntity;

  @Column({
    type: 'int',
    default: 0,
  })
  points_used: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  points_used_at: Date;

  @Column({
    type: 'text',
    default: '',
  })
  reason: string;
}
