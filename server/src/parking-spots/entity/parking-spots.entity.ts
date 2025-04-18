import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservations.entity';

@Entity({ name: 'parking_spots' })
export class ParkingSpot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location: string;

    @OneToMany(() => Reservation, reservation => reservation.parkingSpot)
    reservations: Reservation[];
}
