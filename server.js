const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");
const bot = new Telegraf(process.env.BOT_TOKEN);
const path = require("path");
const axios = require("axios");
const {createUploadPath,photoNameGenerator} = require("./utils/functions");
const { AdminController } = require("./utils/admin.controller");
const adminChatId = process.env.ADMIN_ID;

bot.command("start", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Upload a photo.");
});

bot.on("photo", async (ctx) => {
  try {
    // Gets the highest resolution photo
    const photo = ctx.message.photo.pop();
    const username = ctx.chat.username;
    const fileId = photo.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    const todayStorage = createUploadPath();
    const photoName = photoNameGenerator();
    const filePath = path.join(__dirname, todayStorage,`${username}-${photoName}`);
    const response = await axios.get(fileUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer)
    .on("finish", () => {
      console.log(`Photo received from ${username} and saved successfully in ${todayStorage}`);
      ctx.reply('Photo saved successfully.');
      AdminController.sendPhotoToAdmin(adminChatId, filePath, username);
    })
    .on('error', (err) =>{
      console.log(`Failed to save ${username}'s photo`, err.message);
      ctx.reply('Failed to save the photo.')
    })
  } catch (error) {
    console.log("Failed to receive the photo");
    ctx.reply("Failed to upload the photo");
  }
});

bot.launch(console.log("Bot is running"));
