import { User } from '../../db/schema';

export class UserResponseDto {
  id: number;
  email: string;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
