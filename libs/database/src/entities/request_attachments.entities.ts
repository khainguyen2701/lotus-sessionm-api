import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ManualPointsRequestEntity } from './manual_points_request.entities';

@Entity('request_attachments')
export class RequestAttachmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'file_name',
    length: 100,
  })
  file_name: string;

  @Column({
    type: 'varchar',
    name: 'file_type',
    length: 100,
  })
  file_type: string;

  @Column({
    type: 'text',
    name: 'file_url',
  })
  file_url: string;

  @ManyToOne(
    () => ManualPointsRequestEntity,
    (request) => request.attachments,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      nullable: true,
    },
  )
  request: ManualPointsRequestEntity;

  @Column({
    type: 'timestamp',
    name: 'uploaded_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploaded_at: Date;
}
