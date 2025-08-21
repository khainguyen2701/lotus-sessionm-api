import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitities';

@Entity('accounts')
@Index('idx_accounts_account_email', ['account_email'])
export class AccountsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'account_name',
    length: 100,
    unique: true,
  })
  account_name: string;

  @Column({
    type: 'text',
    name: 'password',
  })
  password: string;

  @Column({ type: 'varchar', name: 'account_email', length: 100, unique: true })
  account_email: string;

  @Column({
    type: 'varchar',
    name: 'account_phone',
    length: 20,
    unique: true,
    nullable: true,
  })
  account_phone: string | null;

  @Column({
    type: 'enum',
    name: 'status',
    enum: ['active', 'inactive', 'deleted'],
    default: 'active',
  })
  status: string;

  @OneToOne(() => UsersEntity, (user) => user.account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UsersEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
