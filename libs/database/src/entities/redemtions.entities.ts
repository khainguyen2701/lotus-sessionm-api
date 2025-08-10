import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';
import { RewardsEntity } from './rewards.entities';

@Entity('redemtions')
export class RedemtionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    default: 0,
  })
  points_used: number;

  @ManyToOne(() => UsersEntity, (user) => user.redemtions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user: UsersEntity;

  @Column({
    type: 'varchar',
    default: '',
  })
  redemption_status: string;

  @ManyToOne(() => RewardsEntity, (reward) => reward.redemtions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  reward: RewardsEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
