import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpot } from './entity/parking-spots.entity';
import { ParkingSpotsService } from './parking-spots.service';
import { ParkingSpotsController } from './parking-spots.controller';
import { Reservation } from '../reservations/entities/reservations.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ParkingSpot, Reservation])],
    providers: [ParkingSpotsService],
    controllers: [ParkingSpotsController],
    exports: [ParkingSpotsService],
})
export class ParkingSpotsModule {}
