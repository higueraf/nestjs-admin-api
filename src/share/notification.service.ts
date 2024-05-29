import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
  logger: any;
  constructor(private readonly httpService: HttpService) {}
  async send(createNotificationDto: CreateNotificationDto): Promise<void> {
    console.log('send', createNotificationDto);
    const url = 'http://localhost:3010/notification';
    try {
      await firstValueFrom(
        this.httpService.post(url, createNotificationDto).pipe(
          catchError((error: any) => {
            console.error('Error sending notification:', error.data);
            throw error; // Re-throw para que el error sea manejado por el código que llama a este método
          }),
        ),
      );
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error; // Re-throw para que el error sea manejado por el código que llama a este método
    }
  }
}
