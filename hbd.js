const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '7149278991:AAHC4Q5KZG46GGrn2NMKONOaVIV17Ow0oso';
const chatId = '1295894956';
const fileName = 'data.csv';
const photoFolder = 'photos/'; 

const today = moment().format('DD/MM');
const tomorrow = moment().add(1, 'days').format('DD/MM');

let foundToday = false;
let foundTomorrow = false;
let messageToSend = '';
let photoPath = ''; // Declaring photoPath outside of the function

// Function to check birthdays for today
function checkToday() {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      const dob = row.DOB;
      if (dob && dob.startsWith(today)) {
        messageToSend += `Today is ${row.Name}'s birthday\n`;
        messageToSend += `Tag - ${row.Tag}\n`;
        messageToSend += `DOB - ${moment(row.DOB, 'DD/MM/YYYY').format('DD MMMM YYYY')}\n`;
        messageToSend += `Address - ${row.Address}\n`;
        messageToSend += `Mobile_No - ${row.Mobile_No}\n`;
        messageToSend += `Email - ${row.Email}\n`;
        photoPath = `${photoFolder}${row.Name}.jpg`;
        foundToday = true;
      }
    })
    .on('end', () => {
      if (foundToday) {
        // Initializing the Telegram bot with polling method
        const bot = new TelegramBot(botToken, { polling: true });

        // Sending the message
        bot.sendMessage(chatId, messageToSend)
          .then(() => {
            console.log('Today\'s message sent successfully');
            // Check if photo exists and send it
            if (fs.existsSync(photoPath)) {
              bot.sendPhoto(chatId, photoPath)
                .then(() => console.log('Photo sent successfully'))
                .catch((error) => console.error('Error sending photo:', error));
            }
            // Stop polling after sending the message
            bot.stopPolling();
          })
          .catch((error) => {
            console.error('Error sending today\'s message:', error);
          });
      }
    });
}

// Function to check birthdays for tomorrow and send only names
function checkTomorrow() {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      const dob = row.DOB;
      if (dob && dob.startsWith(tomorrow)) {
        const nameToSend = `${row.Name}\n`;
        foundTomorrow = true;

        // Initializing the Telegram bot with polling method
        const bot = new TelegramBot(botToken, { polling: true });

        // Sending the message
        bot.sendMessage(chatId, `Tomorrow's birthday:\n${nameToSend}`)
          .then(() => {
            console.log('Tomorrow\'s message sent successfully');
            // Stop polling after sending the message
            bot.stopPolling();
          })
          .catch((error) => {
            console.error('Error sending tomorrow\'s message:', error);
          });
      }
    });
}

// Call the function to check birthdays for tomorrow
checkTomorrow();
// Call the function to check birthdays for today
checkToday();

