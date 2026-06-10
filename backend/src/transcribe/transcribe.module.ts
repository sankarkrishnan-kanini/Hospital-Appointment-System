import { Module } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { TranscribeController } from './transcribe.controller';

@Module({
  providers: [TranscribeService],
  controllers: [TranscribeController]
  
})
export class TranscribeModule {}
