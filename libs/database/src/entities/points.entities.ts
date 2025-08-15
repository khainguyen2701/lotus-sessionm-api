import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';

@Entity('points')
export class PointsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersEntity, (user) => user.points)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column({
    type: 'int',
    name: 'total_points',
    default: 0,
  })
  total_points: number;

  @Column({
    type: 'int',
    name: 'used_points',
    default: 0,
  })
  used_points: number;

  @Column({
    type: 'int',
    name: 'balance_points',
    default: 0,
  })
  balance_points: number;

  @Column({
    type: 'int',
    name: 'available_points',
    default: 0,
  })
  available_points: number;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
