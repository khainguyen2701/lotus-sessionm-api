import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';

@Entity('tiers')
export class TiersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    name: 'tier_name',
    enum: ['bronze', 'gold', 'silver'],
    default: 'bronze',
    unique: true,
  })
  tier_name: string;

  @Column({
    type: 'varchar',
    name: 'tier_description',
    length: 100,
  })
  tier_description: string;

  @OneToOne(() => UsersEntity, (user) => user.tier)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
