import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entitites';

@Entity('tiers')
export class TiersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    name: 'tier_name',
    enum: ['silver', 'bronze', 'gold'],
    default: 'bronze',
    unique: true,
  })
  tier_name: string;

  @Column({
    type: 'text',
    name: 'tier_description',
  })
  tier_description: string;

  @OneToMany(() => UsersEntity, (user) => user.tier)
  users: UsersEntity[];

  @Column({
    type: 'int',
    name: 'min_points',
    default: 0,
  })
  min_points: number;

  @Column({
    type: 'int',
    name: 'max_points',
    default: 0,
  })
  max_points: number;

  @Column({
    type: 'int',
    name: 'priority',
    default: 0,
  })
  priority: number;

  @Column({
    type: 'json',
    name: 'benefit',
    nullable: true,
  })
  benefit: string[];

  @Column({
    type: 'enum',
    name: 'next_tier',
    enum: ['silver', 'bronze', 'gold'],
    nullable: true,
  })
  next_tier: string;

  @Column({
    type: 'enum',
    name: 'previous_tier',
    enum: ['silver', 'bronze', 'gold'],
    nullable: true,
  })
  previous_tier: string;

  @Column({
    type: 'int',
    name: 'maintain_points',
    default: 0,
  })
  maintain_points: number;

  @Column({
    type: 'int',
    name: 'points_reward',
    default: 0,
  })
  points_reward: number;

  @Column({
    type: 'decimal',
    name: 'reward_ratio',
    precision: 10,
    scale: 2,
    default: 10.0,
    comment: 'Số USD cần chi tiêu để nhận 1 điểm (10 = 1 điểm/10 USD)',
  })
  reward_ratio: number;
}
