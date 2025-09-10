import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendMessage(job: { title: string; description: string; _id?: string }) {
    const text = `
Новое объявление!
<b>${job.title}</b>

${job.description}

🔗 ${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/jobs/${job._id}
    `;

    try {
      const res = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: 'HTML',
        }),
      });

      const data = await res.json();
      if (!data) {
        this.logger.error('Ошибка Telegram: ' + JSON.stringify(data));
      }
    } catch (err) {
      this.logger.error('Не удалось отправить в Telegram', err);
    }
  }
}
