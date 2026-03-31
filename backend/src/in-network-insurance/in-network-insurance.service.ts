import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';

@Injectable()
export class InNetworkInsuranceService {

  constructor(private readonly prisma: PrismaService) {}

  // GET /in-network-insurance
  async findAll() {
    return await this.prisma.inNetworkInsurance.findMany({
      include: { office: true }
    });
  }

  // GET /in-network-insurance/:id
  async findOne(id: number) {
    const record = await this.prisma.inNetworkInsurance.findUnique({
      where: { id },
      include: { office: true }
    });
    if (!record) throw new NotFoundException(`InNetworkInsurance #${id} not found`);
    return record;
  }

  // POST /in-network-insurance
  async create(data: CreateInNetworkInsuranceDto) {
    return await this.prisma.inNetworkInsurance.create({ data });
  }

  // PATCH /in-network-insurance/:id
  async update(id: number, data: UpdateInNetworkInsuranceDto) {
    return await this.prisma.inNetworkInsurance.update({ where: { id }, data });
  }

  // DELETE /in-network-insurance/:id
  async remove(id: number) {
    return await this.prisma.inNetworkInsurance.delete({ where: { id } });
  }

  // GET /in-network-insurance/office/:officeId
  async findByOffice(officeId: number) {
    const records = await this.prisma.inNetworkInsurance.findMany({
      where: { officeId },
      orderBy: { insuranceName: 'asc' }
    });
    if (!records.length) throw new NotFoundException(`No insurances found for office #${officeId}`);
    return records;
  }

  // GET /in-network-insurance/search?name=BlueCross
  async search(name: string) {
    const records = await this.prisma.inNetworkInsurance.findMany({
      where: {
        insuranceName: { contains: name }
      },
      include: {
        office: {
          include: { doctor: true }
        }
      },
      orderBy: { insuranceName: 'asc' }
    });
    if (!records.length) throw new NotFoundException(`No offices found accepting insurance "${name}"`);
    return records;
  }

  // DELETE /in-network-insurance/office/:officeId/all
  async removeAllByOffice(officeId: number) {
    const result = await this.prisma.inNetworkInsurance.deleteMany({
      where: { officeId }
    });
    if (result.count === 0) throw new NotFoundException(`No insurances found for office #${officeId}`);
    return { deleted: result.count, message: `Removed ${result.count} insurance(s) from office #${officeId}` };
  }
}
