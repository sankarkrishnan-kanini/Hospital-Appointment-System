import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../prisma/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	
	constructor(){
	   const adapter = new PrismaMariaDb({
			host: "localhost",
			user: "root",
			password: "admin",
			database: "hospitalmanagementdb"
	   });
	   
	   super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}
}
