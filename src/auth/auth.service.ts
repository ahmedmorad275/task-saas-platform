import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  public async register(dto: RegisterDto) {
    const { email, password, name, tenantName } = dto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const tenant = await this.prisma.tenant.create({
      data: {
        name: tenantName,
        users: {
          create: {
            email,
            name,
            password: hashedPassword,
            role: Role.OWNER,
          },
        },
      },
      include: {
        users: true,
      },
    });

    const user = tenant.users[0];

    const token = this.generateToken(user.id, user.tenantId, user.role);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  public async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid email or password');

    const token = this.generateToken(user.id, user.tenantId, user.role);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  private generateToken(userId: string, tenantId: string, role: string) {
    const payload = { sub: userId, tenantId, role };
    return this.jwt.sign(payload);
  }
}
