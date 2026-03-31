import { Controller,Post,Body,Patch,ParseIntPipe,Param} from '@nestjs/common';
import {CreateUserDTO} from './DTOS/CreateUserDTO';
import {UpdateUserDTO} from './DTOS/UpdateUserDTO';
import { UsersService } from './users.service';
import { UseFilters } from '@nestjs/common';
import { CustomExceptionFilter } from 'src/CustomExceptionFilter';
import { HttpStatus } from '@nestjs/common';
@Controller('users')
export class UsersController {
	constructor(private readonly usersService:UsersService)
	{}
	
	@Post()
	@UseFilters(new CustomExceptionFilter())
	create(@Body() dto:CreateUserDTO)
	{
	   return this.usersService.createUser(dto);	
	}
	
	@Patch('id')
	@UseFilters(new CustomExceptionFilter())
	update(@Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number,dto:UpdateUserDTO)
	{
       return this.usersService.updateUser(id,dto);	
	
	}
	
	
}
