import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Reservation } from './entities/reservations.entity';
import { UsersService } from '../users/users.service';
import { ParkingSpotsService } from '../parking-spots/parking-spots.service';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationsRepository: Repository<Reservation>,
        private usersService: UsersService,
        private parkingSpotsService: ParkingSpotsService,
    ) {}

    async bookReservation(
        userId: number,
        parkingSpotId: number,
        reserved_date: string,
        reserved_time: string,
    ): Promise<Reservation> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException(`Пользователь с id ${userId} не найден`);
        }

        const parkingSpot = await this.parkingSpotsService.findOne(parkingSpotId);
        if (!parkingSpot) {
            throw new NotFoundException(`Парковочное место с id ${parkingSpotId} не найдено`);
        }

        const reservation = this.reservationsRepository.create({
            user,
            parkingSpot,
            reserved_date,
            reserved_time,
            status: 'booked',
        });
        return this.reservationsRepository.save(reservation);
    }

    async cancelReservation(reservationId: number): Promise<Reservation> {
        const reservation = await this.reservationsRepository.findOne({ where: { id: reservationId }});
        if (!reservation) {
            throw new NotFoundException(`Бронирование с id ${reservationId} не найдено`);
        }

        reservation.status = 'cancelled';
        return this.reservationsRepository.save(reservation);
    }

    async getReservationsBySpot(spotId: number, from: string, to: string): Promise<Reservation[]> {
        return this.reservationsRepository.find({
            where: {
                parkingSpot: { id: spotId },
                reserved_date: Raw(alias => `${alias} BETWEEN :from AND :to`, { from, to }),
                status: 'booked',
            },
        });
    }

    async getReservationsByUser(userId: number): Promise<Reservation[]> {
        return this.reservationsRepository.find({
            where: { user: { id: userId } },
            order: { reserved_date: 'DESC', reserved_time: 'DESC' },
        });
    }
}
