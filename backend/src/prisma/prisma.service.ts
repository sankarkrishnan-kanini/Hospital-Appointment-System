import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	
	constructor(){
	   const adapter = new PrismaMariaDb({
			host: "localhost",
			user: "root",
			password: "Admin@123",
			database: "hospitalmanagementdb"

	   });
	   
	   super({ adapter });
	}

	async onModuleInit() {

		await this.$connect();

	}

	
}
