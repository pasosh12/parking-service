import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey',  
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
