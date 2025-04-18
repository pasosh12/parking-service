import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { ParkingSpot } from './entity/parking-spots.entity';
import { Reservation } from '../reservations/entities/reservations.entity'; 

@Injectable()
export class ParkingSpotsService {
    constructor(
        @InjectRepository(ParkingSpot)
        private parkingSpotsRepository: Repository<ParkingSpot>,
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,

    ) {}
 
    async findAll(): Promise<ParkingSpot[]> {
        return this.parkingSpotsRepository.find();
    }

    async findOne(id: number): Promise<ParkingSpot> {
        const spot = await this.parkingSpotsRepository.findOne({ where: { id } });
        if (!spot) {
            throw new NotFoundException(`Parking spot with id ${id} not found`);
        }
        return spot;
    }
    async getAvailableTimes(parkingSpotId: number, date: string) {
        // 1. Get all possible slots (e.g., array of strings)
        const allSlots = [
          '08:00:00',
          '09:00:00',
          '10:00:00',
          '19:00:00',
        ];
      
        // 2. Get all reservations for this spot and date
        const reservations = await this.reservationRepository.find({
            where: { parkingSpot: { id: parkingSpotId }, 
            // reserved_date: date
            reserved_date: Raw(alias => `CAST(${alias} AS DATE) = :date`, { date }), 
            status: 'booked',
        }, 
        });
      
        const bookedSlots = reservations.map(r => r.reserved_time);
      
        // 3. Return array of slots with availability flag
        return allSlots.map(time => ({
          time,
          available: !bookedSlots.includes(time),
        }));
      }
    
}
