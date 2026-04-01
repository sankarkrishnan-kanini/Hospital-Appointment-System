import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './DTOS/CreateUserDTO';
import { UpdateUserDTO } from './DTOS/UpdateUserDTO';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    const check = await this.prisma.user.findFirst({
      where: { email: dto.email }
    });
    if (check) throw new BadRequestException('User already exists');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? 'Patient',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async updateUser(id: number, dto: UpdateUserDTO) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date()
      }
    });
  }
}
