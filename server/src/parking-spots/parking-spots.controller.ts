import { Controller, Get, Post, Param, Body, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ParkingSpotsService } from './parking-spots.service';

@Controller('parking-spots')
export class ParkingSpotsController {
    constructor(private readonly parkingSpotsService: ParkingSpotsService) { }

    @Get()
    async getAllParkingSpots() {
        return this.parkingSpotsService.findAll();
    }

    @Get(':id')
    async getParkingSpotById(@Param('id', ParseIntPipe) id: number) {
        return this.parkingSpotsService.findOne(id);
    }
    @Get(':id/available-times')
    async getAvailableTimes(
        @Param('id', ParseIntPipe) id: number,
        @Query('date') date: string  
    ) {
        return this.parkingSpotsService.getAvailableTimes(id, date);
    }
    
}
