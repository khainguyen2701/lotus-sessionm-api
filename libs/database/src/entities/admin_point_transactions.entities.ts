import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitities';

@Entity('admin_point_transactions')
export class AdminPointTransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['earn', 'spend'],
  })
  type: 'earn' | 'spend';

  @Column({
    type: 'enum',
    enum: ['flight', 'purchase', 'other'],
  })
  request_type: 'flight' | 'purchase' | 'other';

  @Column({
    type: 'enum',
    enum: ['processing', 'processed', 'rejected'],
  })
  status: 'processing' | 'processed' | 'rejected';

  @Column({
    type: 'int',
  })
  points_used: number;

  @Column({
    type: 'text',
  })
  description: string;

  @ManyToOne(() => UsersEntity, (user) => user.admin_point_transactions)
  @JoinColumn({ name: 'processed_by' })
  processed_by: UsersEntity;

  @Column({
    type: 'int',
  })
  miles: number;

  @ManyToOne(() => UsersEntity, (user) => user.admin_point_transactions)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
