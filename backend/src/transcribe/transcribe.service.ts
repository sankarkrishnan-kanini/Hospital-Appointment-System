import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import ffmpeg = require('fluent-ffmpeg');
import ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class TranscribeService implements OnModuleInit {
  private pipeline: any;

  async onModuleInit() {
    const { pipeline } = await import('@xenova/transformers');
    this.pipeline = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny.en',
    );
    console.log('Whisper model loaded (local)');
  }

  async transcribeAudio(
    base64Audio: string,
  ): Promise<{ text: string } | undefined> {
    try {
      const cleanBase64 = base64Audio.includes('base64,')
        ? base64Audio.split('base64,')[1]
        : base64Audio;

      const audioBuffer = Buffer.from(cleanBase64, 'base64');
      const wavData = await this.decodeAudioToFloat32(audioBuffer);

      const result = await this.pipeline(wavData, {
        sampling_rate: 16000,
      });

      return { text: result.text?.trim() ?? '' };
    } catch (err) {
      console.error('Error during transcription:', err);
    }
  }

  
  private async decodeAudioToFloat32(buffer: Buffer): Promise<Float32Array> {
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `input_${Date.now()}.webm`);
    const outputPath = path.join(tmpDir, `output_${Date.now()}.wav`);

    fs.writeFileSync(inputPath, buffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .audioFrequency(16000)
        .audioChannels(1)
        .audioCodec('pcm_s16le')
        .format('wav')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });

    const wavBuffer = fs.readFileSync(outputPath);

    // Clean up temp files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    const pcmData = wavBuffer.subarray(44);
    const float32 = new Float32Array(pcmData.length / 2);
    for (let i = 0; i < float32.length; i++) {
      float32[i] = pcmData.readInt16LE(i * 2) / 32768;
    }
    return float32;
  }
}
