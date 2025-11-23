import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../db/schema';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2025-11-23T10:00:00Z',
  })
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
