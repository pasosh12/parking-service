import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { ParkingSpot } from '../../parking-spots/entity/parking-spots.entity';

@Entity({ name: 'reservations' })
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.reservations, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => ParkingSpot, parkingSpot => parkingSpot.reservations, { eager: true })
    @JoinColumn({ name: 'parking_spot_number' })
    parkingSpot: ParkingSpot;

    @Column({ type: 'date' })
    reserved_date: Date;

    @Column({ type: 'time' })
    reserved_time: string;

    @Column({ type: 'enum', enum: ['booked', 'cancelled'], default: 'booked' })
    status: 'booked' | 'cancelled';
}
