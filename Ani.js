const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '7149278991:AAHC4Q5KZG46GGrn2NMKONOaVIV17Ow0oso';
const chatId = '1295894956';
const fileName = 'data.csv';

const today = moment().format('DD/MM');
const tomorrow = moment().add(1, 'days').format('DD/MM');

let foundToday = false;
let foundTomorrow = false;
let messageToSend = '';

// Function to check anniversaries for today
function checkToday() {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      const anniversary = row.Anniversary;
      if (anniversary && anniversary.startsWith(today)) {
        messageToSend += `✨✨Today is ${row.Name}'s anniversary🎊🎊\n`;
        messageToSend += `——————————————————————\n\n`;
        messageToSend += `🔆🔆Anniversary Date - ${moment(row.Anniversary, 'DD/MM/YYYY').format('DD MMMM YYYY')}\n`;
        messageToSend += `❓❓Tag - ${row.Tag}\n`;
        messageToSend += `——————————————————————\n`;
        messageToSend += `——————————————————————\n\n`;
        messageToSend += `Contact Details 📌📌\n`;
        messageToSend += `📮📮Address - ${row.Address}\n\n`;
        messageToSend += `📧📧Email - ${row.Email}\n`;
        messageToSend += `📞📞Mobile_No - ${row.Mobile_No}\n`;
        foundToday = true;
      }
    })
    .on('end', () => {
      if (foundToday) {
        // Initializing the Telegram bot with polling method
        const bot = new TelegramBot(botToken, { polling: true, parse_mode: 'html' });

        // Sending the message
        bot.sendMessage(chatId, messageToSend)
          .then(() => {
            console.log('Today\'s anniversary message sent successfully');
            
            // Stop polling after sending the message
            bot.stopPolling();
          })
          .catch((error) => {
            console.error('Error sending today\'s anniversary message:', error);
          });
      }
    });
}

// Function to check anniversaries for tomorrow and send only names
function checkTomorrow() {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      const anniversary = row.Anniversary;
      if (anniversary && anniversary.startsWith(tomorrow)) {
        const nameToSend = `${row.Name}\n`;
        foundTomorrow = true;

        // Initializing the Telegram bot with polling method
        const bot = new TelegramBot(botToken, { polling: true });

        // Sending the message
        bot.sendMessage(chatId, `Tomorrow's is ${nameToSend} anniversary\n`)
          .then(() => {
            console.log('Tomorrow\'s anniversary message sent successfully');
            // Stop polling after sending the message
            bot.stopPolling();
          })
          .catch((error) => {
            console.error('Error sending tomorrow\'s anniversary message:', error);
          });
      }
    });
}

// Call the function to check anniversaries for tomorrow
checkTomorrow();
// Call the function to check anniversaries for today
checkToday();
