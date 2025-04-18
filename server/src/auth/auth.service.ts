import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersService.validateUser(
            loginUserDto.email,
            loginUserDto.password,
        );
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { userId: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
}
