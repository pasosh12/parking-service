import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservations.entity';
import { ReservationsService } from './reservations.service';
import { UsersModule } from '../users/users.module';
import { ParkingSpotsModule } from '../parking-spots/parking-spots.module';
import { ReservationsController } from './reservations.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reservation]),
        UsersModule,
        ParkingSpotsModule,
    ],
    providers: [ReservationsService],
    controllers:[ReservationsController],
    exports: [ReservationsService],
})
export class ReservationsModule {}
