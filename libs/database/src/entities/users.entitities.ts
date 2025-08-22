import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountsEntity } from './accounts.entities';
import { ManualPointsRequestEntity } from './manual_points_request.entities';
import { PointTransactionsEntity } from './point_transactions.entities';
import { PointsEntity } from './points.entities';
import { SyncLogEntity } from './sync_log.entities';
import { TiersEntity } from './tiers.entities';

@Entity('users')
@Index('idx_users_user_email', ['user_email'])
@Index('idx_users_user_type', ['user_type'])
@Index('idx_users_id', ['id'])
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'user_name',
    length: 100,
    unique: true,
  })
  user_name: string;

  @Column({
    type: 'varchar',
    name: 'user_email',
    length: 100,
    unique: true,
  })
  user_email: string;

  @Column({
    type: 'enum',
    name: 'user_type',
    default: 'user',
    enum: ['user', 'admin'],
  })
  user_type: 'user' | 'admin';

  @OneToOne(() => AccountsEntity, (account) => account.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: AccountsEntity;

  @ManyToOne(() => TiersEntity, (tier) => tier.users, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tier_id' })
  tier: TiersEntity;

  @OneToMany(
    () => PointTransactionsEntity,
    (pointTransaction) => pointTransaction.user,
    {
      cascade: true,
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'point_transaction_id' })
  point_transactions: PointTransactionsEntity[];

  @OneToMany(() => SyncLogEntity, (syncLog) => syncLog.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'sync_log_id' })
  sync_logs: SyncLogEntity[];

  @OneToMany(
    () => ManualPointsRequestEntity,
    (manualPointsRequest) => manualPointsRequest.user,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'manual_points_request_id' })
  manual_points_requests: ManualPointsRequestEntity[];

  @OneToMany(
    () => ManualPointsRequestEntity,
    (manualPointsRequest) => manualPointsRequest.processed_by,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'processed_by' })
  manual_points_requests_process_by: ManualPointsRequestEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    type: 'varchar',
    name: 'first_name',
    length: 100,
    nullable: true,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    length: 100,
    nullable: true,
  })
  last_name: string;

  @Column({
    type: 'enum',
    name: 'gender',
    enum: ['m', 'f'],
    default: 'm',
  })
  gender: string;

  @Column({
    type: 'date',
    name: 'dob',
    nullable: true,
  })
  dob: Date;

  @Column({
    type: 'varchar',
    name: 'address',
    length: 100,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    name: 'city',
    length: 100,
    nullable: true,
  })
  city: string;

  @Column({
    type: 'varchar',
    name: 'state',
    length: 100,
    nullable: true,
  })
  state: string;

  @Column({
    type: 'varchar',
    name: 'zip',
    length: 100,
    nullable: true,
  })
  zip: string;

  @Column({
    type: 'varchar',
    name: 'country',
    length: 100,
    nullable: true,
  })
  country: string;

  @Column({
    type: 'varchar',
    name: 'phone_numbers',
    length: 20,
    nullable: true,
  })
  phone_numbers: string;

  @OneToOne(() => PointsEntity, (points) => points.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'points_id' })
  points: PointsEntity;

  @Column({
    type: 'varchar',
    name: 'user_number',
    length: 100,
    nullable: true,
  })
  user_number: string;

  @Column({
    type: 'varchar',
    name: 'district',
    length: 100,
    nullable: true,
  })
  district: string;

  @Column({
    type: 'varchar',
    name: 'ward',
    length: 100,
    nullable: true,
  })
  ward: string;

  @OneToMany(
    () => PointTransactionsEntity,
    (pointTransactions) => pointTransactions.processed_by,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'processed_by' })
  transactions: PointTransactionsEntity[];

  @Column({
    type: 'enum',
    name: 'status',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;
}
