import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitities';

@Entity('manual_points_request')
@Index('idx_manual_points_request_user_id', ['user'])
@Index('idx_manual_points_request_status', ['status'])
@Index('idx_manual_points_request_ticket_number', ['ticket_number'])
export class ManualPointsRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['flight', 'purchase', 'other'],
    default: 'flight',
  })
  request_type: 'flight' | 'purchase' | 'other';

  @Column({
    type: 'enum',
    enum: ['processing', 'processed', 'rejected'],
    default: 'processing',
  })
  status: 'processing' | 'processed' | 'rejected';

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

  @Column({
    type: 'text',
    default: '',
  })
  reason: string;

  @ManyToOne(() => UsersEntity, (user) => user.manual_points_requests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
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
  @JoinColumn({ name: 'processed_by' })
  processed_by: UsersEntity;

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
  processed_at: Date;

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
    type: 'varchar',
    length: 100,
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
  flight_departure_airport: string;

  @Column({
    type: 'text',
    default: '',
  })
  flight_arrival_airport: string;

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  flight_departure_date: Date;

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  flight_arrival_date: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  distance: number;

  @Column({
    type: 'int',
    default: 0,
  })
  flight_duration: number;

  @Column({
    type: 'text',
    default: 'VNA',
  })
  flight_airline: string;

  @Column({
    type: 'text',
    default: 'VNA',
  })
  request_number: string;

  @Column({
    type: 'text',
    default: 'VNA',
  })
  invoice_number: string;
}
