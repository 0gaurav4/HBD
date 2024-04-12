const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '7149278991:AAHC4Q5KZG46GGrn2NMKONOaVIV17Ow0oso';
const chatId = '1295894956';
const fileName = 'data.csv';

// Initialize the Telegram bot outside of the function
const bot = new TelegramBot(botToken, { polling: true, parse_mode: 'html' });

// Get the current month
const currentMonth = moment().month() + 1; 

let foundBirthday = false;
let birthdays = []; // Store birthdays in an array of objects

let foundAnniversary = false;
let anniversary = []; // Store anniversary in an array of objects

// Function to check birthdays in the current month
function checkBirthdays() {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      const dob = moment(row.DOB, 'DD/MM/YYYY');
      if (dob.month() + 1 === currentMonth) {
        birthdays.push({ name: row.Name, date: dob }); // Add birthday to the array
        foundBirthday = true;
      }
    })
    .on('end', () => {
      if (foundBirthday) {
        // Sort birthdays by day of the month
        birthdays.sort((a, b) => a.date.date() - b.date.date());

        // Construct message with sorted birthdays
        let messageToSend = '🎊🎊Upcoming Birthdays are- \n';
        messageToSend += `——————————————————————\n\n`;
        birthdays.forEach((birthday) => {
          messageToSend += `🎂🎂 ${birthday.name}'s birthday is on ${birthday.date.format('MMMM Do')}\n`;
        });

        // Send the birthday message to the chat
        bot.sendMessage(chatId, messageToSend)
          .then(() => {
            console.log('Birthday message sent successfully');
            // Stop bot polling after sending message
            bot.stopPolling();
          })
          .catch((error) => {
            console.error('Error sending birthday message:', error);
            // Stop bot polling in case of error
            bot.stopPolling();
          });
      } else {
        console.log('No birthdays found for this month');
        // Stop bot polling if no birthdays found
        bot.stopPolling();
      }
      console.log('Birthday check complete');
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      // Stop bot polling in case of error
      bot.stopPolling();
    });
}


function checkAnniversary() {
  fs.createReadStream(fileName)
    .pipe(csv())
    .on('data', (row) => {
      const doa = moment(row.Anniversary, 'DD/MM/YYYY');
      if (doa.month() + 1 === currentMonth) {
        anniversary.push({ name: row.Name, date: doa }); // Add anniversary to the array
        foundAnniversary = true;
      }
    })
    .on('end', () => {
      if (foundAnniversary) {
        // Sort Anniversary by day of the month
        anniversary.sort((a, b) => a.date.date() - b.date.date());

        // Construct message with sorted birthdays
        let messageToSend = '💐💐Upcoming Anniversaries are- \n';
        messageToSend += `——————————————————————\n\n`;
        anniversary.forEach((anniversary) => {
          messageToSend += `🎉🎉${anniversary.name}'s Anniversary is on ${anniversary.date.format('MMMM Do')}\n`;
        });

        // Send the birthday message to the chat
        bot.sendMessage(chatId, messageToSend)
          .then(() => {
            console.log('Anniversary message sent successfully');
            // Stop bot polling after sending message
            bot.stopPolling();
          })
          .catch((error) => {
            console.error('Error sending Anniversary message:', error);
            // Stop bot polling in case of error
            bot.stopPolling();
          });
      } else {
        console.log('No Anniversary found for this month');
        // Stop bot polling if no birthdays found
        bot.stopPolling();
      }
      console.log('Anniversary check complete');
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      // Stop bot polling in case of error
      bot.stopPolling();
    });
}


// Call the function to check birthdays
checkBirthdays();
checkAnniversary();
