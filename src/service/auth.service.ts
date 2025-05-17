import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/dto/auth/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/shared/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: registerDto.email }
        });

        if (exists) throw new ConflictException('Email já registrado');

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                role: registerDto.role ?? 'USER',
            }
        });

        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: JWT_CONFIG.expiresIn,
            secret: JWT_CONFIG.secret
        });

        return {
            access_token: accessToken,
            user: {          
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}