const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json'); // config.json dosyasını alıyoruz

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.cooldowns = new Collection();

client.prefix = config.botPrefix; // Prefix'i config dosyasından alıyoruz

const handlersPath = path.join(__dirname,'src', 'handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

(async () => {
  for (const file of handlerFiles) {
    const filePath = path.join(handlersPath, file);
    const handler = require(filePath);
    await handler(client);
  }

  client.login(config.botToken); // Token'ı config dosyasından alıyoruz
})();

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

module.exports = client;
