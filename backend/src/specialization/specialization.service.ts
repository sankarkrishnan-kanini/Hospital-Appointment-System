import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import { CreateSpecializationDto } from './DTOS/CreateSpecializationDto';
import { UpdateSpecializationDto } from './DTOS/UpdateSpecializationDto';

@Injectable()
export class SpecializationService {

 constructor(private prisma: PrismaService) {}

    create(dto: CreateSpecializationDto) {
        return this.prisma.specialization.create({
        data: dto,
        });
    }

    findAll() {
        return this.prisma.specialization.findMany({
        include: {
            doctors: true,
        },
        });
    }

    findOne(id: number) {
        return this.prisma.specialization.findUnique({
        where: { id },
        });
    }

    update(id: number, dto: UpdateSpecializationDto) {
        return this.prisma.specialization.update({
        where: { id },
        data: dto,
        });
    }

    remove(id: number) {
        return this.prisma.specialization.delete({
        where: { id },
        });
    }

}
