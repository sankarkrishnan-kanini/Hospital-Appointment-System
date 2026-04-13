import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

	constructor(){
	   const adapter = new PrismaMariaDb({
			host: process.env.DB_HOST ?? '127.0.0.1',
			user: process.env.DB_USER ?? 'root',
			password: process.env.DB_PASSWORD ?? '',
			database: process.env.DB_NAME ?? 'hospitalmanagementdb',
	   });
	   super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}
}
