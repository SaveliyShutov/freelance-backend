import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import * as crypto from 'crypto';
import * as https from 'https';

import { OrderClass, OrderDocument } from './schemas/order.schema';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf | null = null;

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
  ) {}

  async onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const gigaKey = process.env.GIGACHAT_API_KEY;

    if (!token) {
      this.logger.warn('⚠️ TELEGRAM_BOT_TOKEN не задан в .env');
      return;
    }

    if (!gigaKey) {
      this.logger.warn('⚠️ GIGACHAT_API_KEY не задан в .env');
      return;
    }

    this.bot = new Telegraf(token);

    this.bot.on('text', async (ctx) => {
      const msg = ctx.message.text;
      const user = ctx.from;

      this.logger.log(`📩 Новое сообщение от ${user.username || user.first_name}: ${msg}`);

      try {
        // --- игнор self-signed сертификата ---
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        // --- получаем access_token ---
        const authResp = await axios.post(
          'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
          'scope=GIGACHAT_API_PERS',
          {
            headers: {
              Authorization: `Basic ${gigaKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              RqUID: crypto.randomUUID(),
            },
            httpsAgent,
          },
        );

        const accessToken = authResp.data.access_token;

        // --- отправляем запрос в GigaChat ---
        const gptResp = await axios.post(
          'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
          {
            model: 'GigaChat:latest',
            messages: [
              {
                role: 'system',
                content: `
Ты парсер заказов. Верни строго JSON с полями:
- title
- description
- date (YYYY-MM-DD, учитывай "сегодня/завтра/послезавтра" относительно ${new Date().toISOString().split('T')[0]})
- startTime
- address
- budget (оплата за одного человека; если указана только общая сумма и количество людей — дели; если только сумма без количества — это за одного)
- hours

Если данных нет — пиши "не указано". Никакого текста кроме JSON.`,
              },
              { role: 'user', content: msg },
            ],
            temperature: 0.2,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            httpsAgent,
          },
        );

        const rawText = gptResp.data.choices[0].message.content;
        let parsedOrder: any;

        try {
          parsedOrder = JSON.parse(rawText);
        } catch {
          this.logger.warn('⚠️ Не удалось распарсить JSON из ответа GigaChat, используем fallback');
          parsedOrder = {
            title: `Сообщение от ${user.username || user.first_name}`,
            description: msg,
            date: new Date().toISOString().split('T')[0],
            startTime: 'не указано',
            address: 'не указано',
            budget: 'не указано',
            hours: 'не указано',
          };
        }

        // --- нормализация данных ---
        const safeDate = new Date(parsedOrder.date);
        const orderDate = isNaN(safeDate.getTime()) ? new Date() : safeDate;

        const createdOrder = await this.orderModel.create({
          title: parsedOrder.title || `Сообщение от ${user.username || user.first_name}`,
          description: parsedOrder.description || msg,
          applications: [],
          employer_id: new Types.ObjectId(), // placeholder
          employer_name: user.username || user.first_name,
          date: orderDate,
          startTime: parsedOrder.startTime !== 'не указано' ? parsedOrder.startTime : '',
          address: parsedOrder.address !== 'не указано' ? parsedOrder.address : '',
          budget: parsedOrder.budget !== 'не указано' ? parsedOrder.budget : '',
          hours: parsedOrder.hours !== 'не указано' ? parsedOrder.hours : '',
          paymentType: 'shift',
          type: 'Объявление из Telegram',
          createdAt: new Date(),
          dateType: 'by agreement',
        });

        await ctx.reply(`✅ Объявление сохранено (#${createdOrder._id})`);
      } catch (err) {
        this.logger.error('❌ Ошибка при сохранении заказа', err as Error);
        await ctx.reply('⚠️ Не удалось сохранить объявление');
      }
    });

    this.bot.launch()
      .then(() => this.logger.log('🤖 Telegram-бот запущен и слушает сообщения'))
      .catch(err => this.logger.error('🚨 Ошибка запуска Telegram-бота', err));
  }

  async onModuleDestroy() {
    if (this.bot) {
      await this.bot.stop();
      this.logger.log('🛑 Telegram-бот остановлен');
    }
  }
}
