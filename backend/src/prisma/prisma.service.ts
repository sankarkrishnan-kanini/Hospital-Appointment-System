import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	
	constructor(){
	   const adapter = new PrismaMariaDb({
<<<<<<< HEAD
			host: "localhost",
			user: "root",
			password: "Admin@123",
			database: "hospitalmanagementdb"
			
=======
			host: process.env.DB_HOST || '127.0.0.1',
			port: parseInt(process.env.DB_PORT || '3306'),
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME || 'hospitalmanagementdb'

>>>>>>> 2cead8bd0d20017ee3a1baf7c4ccb53a2d6349b1
	   });
	   
	   super({ adapter });
	}

	async onModuleInit() {

		await this.$connect();

	}

	
}
