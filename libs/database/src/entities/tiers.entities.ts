import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entitites';

@Entity('tiers')
export class TiersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    name: 'tier_name',
    enum: ['silver', 'titan', 'gold', 'platinum', 'million-miles'],
    default: 'silver',
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
}
