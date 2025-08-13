import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';

@Entity('manual_points_request')
export class ManualPointsRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['flight', 'purchase'],
    default: 'flight',
  })
  request_type: 'flight' | 'purchase' | 'other';

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  request_status: 'pending' | 'approved' | 'rejected';

  @Column({
    type: 'int',
    default: 0,
  })
  points: number;

  @Column({
    type: 'int',
    default: 0,
  })
  discount: number;

  @Column({
    type: 'text',
    default: '',
  })
  description: string;

  @ManyToOne(() => UsersEntity, (user) => user.manual_points_requests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  user: UsersEntity;

  @ManyToOne(
    () => UsersEntity,
    (user) => user.manual_points_requests_process_by,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'process_by' })
  process_by: UsersEntity;

  @Column({
    type: 'text',
    default: '',
  })
  file_name: string;

  @Column({
    type: 'text',
    default: '',
  })
  file_url: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploaded_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  process_at: Date;

  @Column({
    type: 'text',
    default: '',
  })
  seat_code: string;

  @Column({
    type: 'text',
    default: '',
  })
  seat_class: string;

  @Column({
    type: 'text',
    default: '',
  })
  ticket_number: string;

  @Column({
    type: 'text',
    default: '',
  })
  flight_code: string;

  @Column({
    type: 'text',
    default: '',
  })
  flight_router_from: string;

  @Column({
    type: 'text',
    default: '',
  })
  flight_router_to: string;

  @Column({
    type: 'date',
    default: null,
  })
  flight_date: Date;

  @Column({
    type: 'bigint',
    default: 0,
  })
  distance: number;
}
