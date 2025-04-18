
import { Controller, Post, Delete, Get, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {

    @Get('/spot/:spotId')
    async getReservationsBySpot(
      @Param('spotId', ParseIntPipe) spotId: number,
      @Query('from') from: string,
      @Query('to') to: string
    ) {
      return this.reservationsService.getReservationsBySpot(spotId, from, to);
    }
    constructor(private readonly reservationsService: ReservationsService) { }


    @Post('book')
    async createReservation(
        @Body('userId') userId: number,
        @Body('parkingSpotId') parkingSpotId: number,
        @Body('reserved_date') reserved_date: string,
        @Body('reserved_time') reserved_time: string,
    ) {
        return this.reservationsService.bookReservation(userId, parkingSpotId, reserved_date, reserved_time);
    }

    @Delete(':id')
    async cancelReservation(@Param('id', ParseIntPipe) id: number) {
        return this.reservationsService.cancelReservation(id);
    }

    @Get('/user/:userId')
    async getReservationsByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.reservationsService.getReservationsByUser(userId);
    }
}
