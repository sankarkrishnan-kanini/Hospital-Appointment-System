import { Injectable } from '@nestjs/common';
import {prisma} from '../adaptor'
@Injectable()
export class AppointmentService {


    findAll()
   {

      return prisma.appointment
   }


}
