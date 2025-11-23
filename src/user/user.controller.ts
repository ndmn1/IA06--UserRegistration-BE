import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with email and password',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      example1: {
        summary: 'Example registration',
        value: {
          email: 'john.doe@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User registered successfully',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'john.doe@example.com' },
            createdAt: { type: 'string', example: '2025-11-23T10:00:00Z' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Validation failed' },
        errors: {
          type: 'array',
          items: { type: 'string' },
          example: ['Email must be a valid email address'],
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'User already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'User with this email already exists',
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and return JWT token',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'User login credentials',
    examples: {
      example1: {
        summary: 'Example login',
        value: {
          email: 'john.doe@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Login successful',
        },
        data: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'john.doe@example.com' },
                createdAt: { type: 'string', example: '2025-11-23T10:00:00Z' },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Validation failed' },
        errors: {
          type: 'array',
          items: { type: 'string' },
          example: ['Email must be a valid email address'],
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid email or password' },
      },
    },
  })
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get current authenticated user profile information',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Profile retrieved successfully',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'john.doe@example.com' },
            createdAt: { type: 'string', example: '2025-11-23T10:00:00Z' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async getProfile(
    @Request() req: { user: { id: string; email: string } },
  ): Promise<{
    message: string;
    user: UserResponseDto;
  }> {
    const user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      throw new Error('User not found');
    }
    const userResponse = new UserResponseDto(user);

    return {
      message: 'Profile retrieved successfully',
      user: userResponse,
    };
  }
}
