import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountsEntity } from './accounts.entities';
import { TiersEntity } from './tiers.entities';
import { PointTransactionsEntity } from './point_transactions.entities';
import { RedemtionsEntity } from './redemtions.entities';
import { SessionmAccountsEntity } from './sessionm_accounts.entities';
import { SyncLogEntity } from './sync_log.entities';
import { ManualPointsRequestEntity } from './manual_points_request.entities';

@Entity('users')
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

  @OneToOne(() => TiersEntity, (tier) => tier.user, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
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
  point_transactions: PointTransactionsEntity[];

  @OneToMany(() => RedemtionsEntity, (redemption) => redemption.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  redemtions: RedemtionsEntity[];

  @OneToOne(
    () => SessionmAccountsEntity,
    (sessionmAccount) => sessionmAccount.user,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
      cascade: true,
    },
  )
  sessionm_account: SessionmAccountsEntity;

  @OneToMany(() => SyncLogEntity, (syncLog) => syncLog.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
    cascade: true,
  })
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
  manual_points_requests: ManualPointsRequestEntity[];

  @OneToMany(
    () => ManualPointsRequestEntity,
    (manualPointsRequest) => manualPointsRequest.process_by,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
      cascade: true,
    },
  )
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
}
