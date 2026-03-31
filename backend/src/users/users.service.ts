import { Injectable,BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO} from './DTOS/CreateUserDTO';
import { UpdateUserDTO } from './DTOS/UpdateUserDTO';
@Injectable()
export class UsersService {

    constructor(private readonly prisma:PrismaService)
    {
       
    }
    async createUser(dto:CreateUserDTO)
    {
        const check =await this.prisma.user.findFirst({
            where:{
                email:dto.email,
                password:dto.password
            }
        });
        if(check)
        {
            return new BadRequestException( "User already exists");
        }
		
		const created=await this.prisma.user.create(
		{
		   data:{
              ...dto,
			  createdAt:new Date().toISOString(),
			  updatedAt:new Date().toISOString()
		    
		   },		   
			
		}
		);
		
		return created;
        
    }
	
	async updateUser(id:number,dto:UpdateUserDTO)
	{

		return await this.prisma.user.update(
		{
		   where:{id},
           data:{
              
			  ...dto,
			  updatedAt:new Date().toISOString()
		   },			   
		}
		
		);
		 
		
	}


}
