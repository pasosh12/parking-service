import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./auth/auth.module";
import { ParkingSpotsModule } from './parking-spots/parking-spots.module';
import { ReservationsModule } from "./reservations/reservations.module";
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule, ParkingSpotsModule, AuthModule, ReservationsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD ,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
      driver: require('mysql2')
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
