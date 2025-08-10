import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { PrimaryGeneratedColumn } from 'typeorm';
import { RedemtionsEntity } from './redemtions.entities';

@Entity('rewards')
export class RewardsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    default: 0,
  })
  points_required: number;

  @Column({
    type: 'varchar',
    default: '',
  })
  reward_name: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  reward_description: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  reward_type: string;

  @OneToMany(() => RedemtionsEntity, (redemption) => redemption.reward, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  redemtions: RedemtionsEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
