import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	
	constructor(){
	   const adapter = new PrismaMariaDb({
			host: "127.0.0.1",
			user: "root",
			password: "Admin@123456789$1",
			database: "hospitalbookingdb"

	   });
	   
	   super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}

	
}
