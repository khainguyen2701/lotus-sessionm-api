import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';
import { SyncLogEntity } from './sync_log.entities';

@Entity('sessionm_accounts')
export class SessionmAccountsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  sessionm_account_id: string;

  @Column({
    type: 'int',
    default: 0,
  })
  total_points: number;

  @Column({
    type: 'int',
    default: 0,
  })
  available_points: number;

  @Column({
    type: 'int',
    default: 0,
  })
  used_points: number;

  @OneToOne(() => UsersEntity, (user) => user.sessionm_account, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user: UsersEntity;

  @OneToMany(() => SyncLogEntity, (syncLog) => syncLog.sessionm_account, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
    cascade: true,
  })
  sync_logs: SyncLogEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
