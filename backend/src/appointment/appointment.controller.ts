import { Controller, Get ,Post,Body} from '@nestjs/common';

@Controller('appointment')
export class AppointmentController {

    constructor(appointmentService:)[

    ]

    @Get()
    findAll(){

        return 
    }

    @Post()
    create(@Body() )
    {

    }

    @Get(':id')
    findOne(@Para)
}
