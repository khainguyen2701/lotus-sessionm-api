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
import { PointTransactionsEntity } from './point_transactions.entities';
import { UsersEntity } from './users.entitities';

@Entity('sync_log')
export class SyncLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  sync_type: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  sync_status: string;

  @Column({
    type: 'text',
    default: '',
  })
  payload: string;

  @Column({
    type: 'text',
    default: '',
  })
  response: string;

  @ManyToOne(() => UsersEntity, (user) => user.sync_logs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  user: UsersEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    () => PointTransactionsEntity,
    (pointTransaction) => pointTransaction.sync_log,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'point_transaction_id' })
  point_transaction: PointTransactionsEntity;
}
