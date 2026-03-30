import { Injectable } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	
	constructor(){
	   const adapter = new PrismaMariaDb({
			host: "localhost",
			user: "root",
			password: "Admin@123456789$1",
			database: "hospitalmanagementdb"
	   });
	   
	   super({ adapter });
	}
}
