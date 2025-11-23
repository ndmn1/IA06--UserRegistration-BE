import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    message: string;
    user: UserResponseDto;
  }> {
    const user = await this.userService.create(createUserDto);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<{
    message: string;
    data: AuthResponseDto;
  }> {
    const authResponse = await this.authService.login(loginUserDto);

    return {
      message: 'Login successful',
      data: authResponse,
    };
  }
}
