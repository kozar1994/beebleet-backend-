import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany();
  }
}
