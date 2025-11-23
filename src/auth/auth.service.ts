import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthResponseDto } from '../user/dto/auth-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import type { User } from '../db/schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // Reconstruct user object for UserResponseDto
    const userWithPassword = { ...user, password: '' };
    const userResponse = new UserResponseDto(userWithPassword);

    return new AuthResponseDto(accessToken, userResponse);
  }
}
