import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entitites';
import { RequestAttachmentsEntity } from './request_attachments.entities';

@Entity('manual_points_request')
export class ManualPointsRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['points', 'discount'],
    default: 'points',
  })
  request_type: 'points' | 'discount';

  @Column({
    type: 'enum',
    enum: ['waiting', 'approved', 'rejected'],
    default: 'waiting',
  })
  request_status: 'waiting' | 'approved' | 'rejected';

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

  @OneToMany(
    () => RequestAttachmentsEntity,
    (attachment) => attachment.request,
    {
      cascade: true,
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  attachments: RequestAttachmentsEntity[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  process_at: Date;
}
