const {Telegraf} = require('telegraf');
const { getTime } = require('./functions');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

class AdminController{
    async sendPhotoToAdmin(chatId, filePath, username){
        try {
            await bot.telegram.sendPhoto(chatId, {source: filePath}, 
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: 'Confirm', callback_data: 'confirmAction'},
                                {text: 'Deny', callback_data: 'denyAction'}
                            ],
                            [
                                {text: 'Connect to sender.', url: `https://t.me/${username}`}
                            ]
                        ]
                    }
                });
            const time = getTime();
            console.log(`${username} sent a photo at: ${time}`);
        } catch (error) {
            console.log(`Failed to send the ${username}'s photo to admin.`);
        }
    }
}

module.exports = {
    AdminController: new AdminController
}