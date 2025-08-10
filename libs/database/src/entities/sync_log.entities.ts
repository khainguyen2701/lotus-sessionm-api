import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntity } from './users.entitites';
import { SessionmAccountsEntity } from './sessionm_accounts.entities';

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

  @ManyToOne(
    () => SessionmAccountsEntity,
    (sessionmAccount) => sessionmAccount.sync_logs,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  sessionm_account: SessionmAccountsEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
