import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Telegraf, Markup } from 'telegraf';
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
    // Помести в файл/вершину TelegramService (минимальные изменения)
function isPotentialWork(msg: string): { ok: boolean; score: number; reasons: string[] } {
  const text = msg.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  // + ключевые слова (сильные)
  const strong = ['требуется', 'требуются', 'нужен', 'нужны', 'ищем', 'ищется', 'вакансия', 'вакансии'];
  for (const w of strong) if (text.includes(w)) { score += 3; reasons.push(`+kw:${w}`); }

  // + слова про оплату
  const pay = ['плачу', 'оплата', 'руб', '₽', 'з/п', 'зарплата'];
  for (const w of pay) if (text.includes(w)) { score += 3; reasons.push(`+pay:${w}`); }

  // + слова про время/смены
  const timeWords = ['час', 'часа', 'день', 'дней', 'смена', 'смены', 'вечером', 'утром', 'завтра', 'послезавтра', 'сегодня'];
  for (const w of timeWords) if (text.includes(w)) { score += 2; reasons.push(`+time:${w}`); }

  // + наличие чисел/сумм (например "1000", "6 000", "6000р", "1000 руб")
  const moneyRegex = /(\d[\d\s.,]*\s?(руб|р\b|₽)|\b\d{3,}\b)/i;
  if (moneyRegex.test(text)) { score += 3; reasons.push('+money'); }

  // + "на X человек" или "X человек"
  const pplRegex = /\b(\d+)\s*(человека|чел|человек|людей)\b/i;
  if (pplRegex.test(text)) { score += 2; reasons.push('+people'); }

  // + если есть диапазон времени или "с 10 до 18"
  const timeRange = /с\s*\d{1,2}[:.]?\d{0,2}\s*(до|-)\s*\d{1,2}[:.]?\d{0,2}/i;
  if (timeRange.test(text)) { score += 2; reasons.push('+timerange'); }

  // - слова явной шутки / неработы
  const jokewords = ['прикол', 'шутк', 'мем', 'лол', 'хаха', 'хах', 'пранк', 'смешн', 'хуй','хуе','бля','лох','лош','чурк','член','еблан','писюн','машонк','мошонк','гей','геи','срак','героин','гера','герыч','мефедрон','соль','прон','порн','сэкс','меф'];
  for (const w of jokewords) if (text.includes(w)) { score -= 6; reasons.push(`-joke:${w}`); }

  // - короткие / однословные сообщения
  if (text.trim().split(/\s+/).length < 3) { score -= 2; reasons.push('-too-short'); }

  // - массовые фразы типа "как дела" "привет"
  const trivial = ['привет', 'как дела', 'здорово', 'ура', 'спасибо'];
  for (const w of trivial) if (text.includes(w)) { score -= 4; reasons.push(`-trivial:${w}`); }

  // длина: дополнительные очки если > 40 символов (вероятно реальное объявление)
  if (text.length > 40) { score += 1; reasons.push('+long'); }

  // итоговый порог — подстраивай: 3 — агрессивнее, 6 — строже.
  const threshold = 4;
  return { ok: score >= threshold, score, reasons };
}

    const check = isPotentialWork(msg);
if (!check.ok) {
  this.logger.log(`⏭ Пропуск (score=${check.score}): ${check.reasons.join(', ')}`);
  return;
}
this.logger.log(`✅ Прошло фильтр (score=${check.score}): ${check.reasons.join(', ')}`);


    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

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

        const gptResp = await axios.post(
          'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
          {
            model: 'GigaChat:latest',
            messages: [
              {
                role: 'system',
                content: `
Ты парсер заказов. Отвечай строго JSON.
Поля:
- title: кратко название работы
- description: сама суть задания
- date: YYYY-MM-DD (понимай "сегодня/завтра/послезавтра" относительно ${new Date().toISOString().split('T')[0]})
- startTime: если есть время (например "с 10:00"), иначе "не указано"
- address: место работы
- budget: оплата на 1 человека. Логика:
  * если указана общая сумма и кол-во людей → дели
  * если сумма "за час" и указаны часы → умножь
  * если сумма "за день" → бери её
  * если сумма указана без уточнения, например "за смену плачу 4000" → это за 1 человека
- hours: длительность работы в часах (если указано время начала и конца — вычисли)


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

        const message = `
<b>✨ Новое объявление!</b>

<b>${parsedOrder.title}</b>
📝 ${parsedOrder.description}

📅 <b>Дата:</b> ${parsedOrder.date || 'не указано'}
⏰ <b>Время:</b> ${parsedOrder.startTime || 'не указано'}
📍 <b>Адрес:</b> ${parsedOrder.address || 'не указано'}
💰 <b>Оплата:</b> ${parsedOrder.budget || 'не указано'} рублей
⏳ <b>Длительность:</b> ${parsedOrder.hours || 'не указано'} ${parsedOrder.hours > 4 ? 'часов' : (parsedOrder.hours == 1 ? 'час' : (parsedOrder.hours>=2 && parsedOrder.hours<=4 ? 'часа' : ''))}

👤 Автор: ${user.username ? '@' + user.username : user.first_name}
        `;

        await ctx.replyWithHTML(
          message,
          Markup.inlineKeyboard([
            [
              Markup.button.callback('💬 Откликнуться', `http://localhost:3011/apply/${createdOrder._id}`),
              parsedOrder.address && parsedOrder.address !== 'не указано'
                ? Markup.button.url('📍 Открыть карту', `https://yandex.ru/maps/?text=${encodeURIComponent(parsedOrder.address)}`)
                : null,
            ].filter(Boolean),
            user.username
              ? [Markup.button.url('📞 Связаться', `https://t.me/${user.username}`)]
              : [],
          ])
        );

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
