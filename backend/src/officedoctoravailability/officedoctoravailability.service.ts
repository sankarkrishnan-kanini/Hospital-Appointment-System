import { Injectable,BadRequestException,NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OfficedoctoravailabilityService {

    constructor(private readonly prisma: PrismaService) {}
    


}
