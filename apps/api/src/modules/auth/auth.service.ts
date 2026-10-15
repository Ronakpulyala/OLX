import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { SendOtpDto, VerifyOtpDto } from './auth.dto';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async sendOtp(dto: SendOtpDto) {
    const identifier = dto.email || dto.phone;
    if (!identifier) throw new BadRequestException('Email or phone required');
    
    const otp = '123456'; // Mock OTP for now
    await this.redis.set(`otp:${identifier}`, otp, 'EX', 300);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const storedOtp = await this.redis.get(`otp:${dto.identifier}`);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    await this.redis.del(`otp:${dto.identifier}`);

    let user = await this.userRepository.findOne({ 
      where: dto.identifier.includes('@') ? { email: dto.identifier } : { phone: dto.identifier }
    });

    if (!user) {
      user = this.userRepository.create({
        email: dto.identifier.includes('@') ? dto.identifier : null,
        phone: !dto.identifier.includes('@') ? dto.identifier : null,
        name: 'New User',
        isVerified: true,
      });
      user = await this.userRepository.save(user);
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET || 'refreshsecret' });
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET || 'refreshsecret', expiresIn: '7d' }),
    };
  }
}