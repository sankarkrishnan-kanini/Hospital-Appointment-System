import { Controller,Post,Body } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';

@Controller('transcribe')
export class TranscribeController {
    
    constructor(private readonly transcribeService:TranscribeService) {}

    @Post()
    async transcribeAudio(@Body() body:{audio:string}):Promise<{transcription:string|undefined}>{
        const transcription=await this.transcribeService.transcribeAudio(body.audio);
        return {transcription: transcription?.text};
    }
 



}
