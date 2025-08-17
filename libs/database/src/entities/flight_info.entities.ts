import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

enum ClassTicket {
  ECONOMY = 'economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

@Entity({
  name: 'flight_info',
})
@Index('idx_flight_info_ticket_number', ['ticket_number'])
@Index('idx_flight_info_seat_code', ['seat_code'])
@Index('idx_flight_info_ticket_seat', ['ticket_number', 'seat_code'])
@Index('idx_flight_info_departure_date', ['flight_departure_date'])
@Index('idx_flight_info_class_ticket', ['class_ticket'])
export class FlightInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    default: 0,
  })
  distance: number;

  @Column({
    type: 'text',
    default: '',
  })
  seat_code: string;

  @Column({
    type: 'enum',
    default: ClassTicket.ECONOMY,
    enum: ClassTicket,
  })
  class_ticket: ClassTicket;

  @Column({
    type: 'varchar',
    length: 100,
    default: '',
  })
  ticket_number: string;

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
    type: 'text',
    default: '',
  })
  flight: string;
}
