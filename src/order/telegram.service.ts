import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Telegraf } from 'telegraf';

import { OrderClass } from './schemas/order.schema';
import { UserClass } from '../user/schemas/user.schema';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);

  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;
  private bot: Telegraf;

  constructor(
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
  ) {
    if (!this.token) {
      throw new Error('TELEGRAM_BOT_TOKEN не задан в .env');
    }
    this.bot = new Telegraf(this.token);
  }

  async onModuleInit() {
    // Ловим все текстовые сообщения из группы
    this.bot.on('text', async (ctx) => {
      const msg = ctx.message.text;
      const user = ctx.from;

      this.logger.log(`Новое сообщение из Telegram: ${msg}`);

      try {
        // создаём заказ
        const orderFromDb = await this.OrderModel.create({
          title: `Сообщение от ${user.username || user.first_name}`,
          description: msg,
          employer_id: user.id.toString(), // сохраняем Telegram id как employer_id
        });

        // обновляем юзера (если он есть в базе)
        await this.UserModel.findByIdAndUpdate(orderFromDb.employer_id, {
          $push: { employer_orders: orderFromDb._id },
        });

        // уведомляем группу
        await this.sendMessage({
          title: orderFromDb.title,
          description: orderFromDb.description,
          _id: orderFromDb._id.toString(),
        });

        // ответ пользователю
        await ctx.reply(`✅ Объявление сохранено (#${orderFromDb._id})`);
      } catch (err) {
        this.logger.error('Ошибка при сохранении заказа из Telegram', err as Error);
        await ctx.reply('❌ Не удалось сохранить объявление');
      }
    });

    // Запуск бота
    await this.bot.launch();
    this.logger.log('Telegram бот успешно запущен и слушает сообщения');
  }

  async sendMessage(job: { title: string; description: string; _id?: string }) {
    const cleanDescription = job.description
      ?.replace(/<\/?(p|div|br|span)[^>]*>/g, '')
      .trim();

    const text = `
Новое объявление!
<b>${job.title}</b>

${cleanDescription}

🔗 ${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/jobs/${job._id}
    `;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${this.token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.chatId,
            text,
            parse_mode: 'HTML',
          }),
        },
      );

      const data = await res.json();
      if (!data.ok) {
        this.logger.error('Ошибка Telegram API: ' + JSON.stringify(data));
      }
    } catch (err) {
      this.logger.error('Не удалось отправить сообщение в Telegram', err as Error);
    }
  }
}
