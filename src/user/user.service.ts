import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as bcrypt from 'bcryptjs';
import { users, User, NewUser } from '../db/schema';
import { DRIZZLE } from '../db/drizzle.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser: NewUser = {
        email,
        password: hashedPassword,
      };

      const [savedUser] = await this.db
        .insert(users)
        .values(newUser)
        .returning();

      // Return user data without password
      return new UserResponseDto(savedUser);
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }
}
