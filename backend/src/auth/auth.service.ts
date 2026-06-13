import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly activityLogs: ActivityLogsService,
    private readonly systemSettingsService: SystemSettingsService,
  ) {}

  async register(dto: RegisterDto) {
    const settings = await this.systemSettingsService.getSettings();
    if (!settings.allowPublicRegistration) {
      throw new ForbiddenException('Pendaftaran akun publik sedang dinonaktifkan');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { ...dto, email: dto.email.toLowerCase(), password },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await this.activityLogs.log({
      actorId: user.id,
      action: 'REGISTER',
      entityType: 'USER',
      entityId: user.id,
      description: `Akun baru dibuat oleh ${user.email}`,
      metadata: { email: user.email, role: user.role },
    });

    return { user, accessToken: await this.sign(user.id, user.email, user.role) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Email atau password salah');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Email atau password salah');

    const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    await this.activityLogs.log({
      actorId: user.id,
      action: 'LOGIN',
      entityType: 'AUTH',
      entityId: user.id,
      description: `${user.email} berhasil login`,
      metadata: { role: user.role },
    });
    return { user: safeUser, accessToken: await this.sign(user.id, user.email, user.role) };
  }

  async profile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  profileActivity(userId: string) {
    return this.activityLogs.findByActor(userId, 20);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    const email = dto.email.toLowerCase();
    if (email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) throw new ConflictException('Email sudah terdaftar');
    }

    let password: string | undefined;
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Password saat ini wajib diisi untuk mengganti password');
      }

      const validCurrentPassword = await bcrypt.compare(dto.currentPassword, user.password);
      if (!validCurrentPassword) {
        throw new UnauthorizedException('Password saat ini tidak sesuai');
      }

      password = await bcrypt.hash(dto.newPassword, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email,
        password,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await this.activityLogs.log({
      actorId: userId,
      action: 'PROFILE_UPDATED',
      entityType: 'USER',
      entityId: userId,
      description: `${updatedUser.email} memperbarui profil`,
      metadata: { email: updatedUser.email, passwordChanged: Boolean(password) },
    });

    return updatedUser;
  }

  private sign(id: string, email: string, role: string) {
    return this.jwt.signAsync(
      { sub: id, email, role },
      { expiresIn: this.config.get<string>('JWT_EXPIRES_IN') ?? '1d' },
    );
  }
}
