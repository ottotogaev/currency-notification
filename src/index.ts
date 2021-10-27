import axios from "axios";
import { Error } from "mongoose";
import { Telegraf } from "telegraf";
import cron from "node-cron";

require("dotenv").config();

// dotenv.config();
const BOT_TOKEN =
  process.env.BOT_TOKEN || "839609997:AAF8U9Mzbz47mM-RdInZ1oghk361w1YEIaw";

enum Currencies {
  usd,
  euro,
  rub,
}
const group_id = process.env.GROUP_ID || '-567259948';

// console.log(BOT_TOKEN);

const bot = new Telegraf(BOT_TOKEN);

async function getRate() {
  try {
    const { data }: any = await axios.get(
      "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
    );

    const result = {
      usd: data[Currencies.usd],
      euro: data[Currencies.euro],
      rub: data[Currencies.rub],
    };

    const prices = {
      usd: parseFloat(result.usd.Rate),
      euro: parseFloat(result.euro.Rate),
      rub: parseFloat(result.rub.Rate),
      oldUsd: parseFloat(result.usd.Rate) - parseFloat(result.usd.Diff),
      oldEuro: parseFloat(result.euro.Rate) - parseFloat(result.euro.Diff),
      oldRub: parseFloat(result.rub.Rate) - parseFloat(result.rub.Diff),
    };
    const diffPercent = {
      usd:
        (((prices.usd - prices.oldUsd) / prices.oldUsd) * 100).toPrecision(3) +
        "%",
      euro:
        (((prices.euro - prices.oldEuro) / prices.oldEuro) * 100).toPrecision(
          3
        ) + "%",
      rub:
        (((prices.rub - prices.oldRub) / prices.oldRub) * 100).toPrecision(3) +
        "%",
    };

    return { prices, diffPercent };
  } catch (e) {
    throw new Error("Catch error");
  }
}

cron.schedule("00 00 09 * * * ", async () => {  
  const { prices, diffPercent } = await getRate();
    const res = `
  1.💵 USD: ${prices.usd} 
      Diff(${diffPercent.usd}) 
  2.💶 EURO: ${prices.euro}
      Diff(${diffPercent.euro})
  3.💴 RUB: ${prices.rub}
      Diff(${diffPercent.rub})
      `;

  bot.telegram.sendMessage(group_id, `<code>${res}</code>`, { parse_mode: 'HTML' });

});

  bot.start(async (ctx: any) => {
    const { prices, diffPercent } = await getRate();
    const res = `
  1.💵 USD: ${prices.usd} 
      Diff(${diffPercent.usd}) 
  2.💶 EURO: ${prices.euro}
      Diff(${diffPercent.euro})
  3.💴 RUB: ${prices.rub}
      Diff(${diffPercent.rub})
      `;
    ctx.replyWithHTML(`<code> ${res} </code>`);
  });

bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
