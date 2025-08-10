import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({
    type: 'int',
    name: 'tier_price',
    default: 0,
  })
  tier_price: number;

  @Column({
    type: 'int',
    name: 'tier_duration',
    default: 0,
  })
  tier_duration: number;

  @Column({
    type: 'int',
    name: 'tier_max_user',
    default: 0,
  })
  tier_max_user: number;

  @OneToOne(() => UsersEntity, (user) => user.tier)
  user: UsersEntity;
}
