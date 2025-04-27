const { Collection, ChannelType } = require('discord.js');
const config = require("../../config.json");


module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.botPrefix)) return; 

    const args = message.content
      .slice(config.botPrefix.length)
      .trim()
      .split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    if (command.guildOnly && message.channel.type === ChannelType.DM) {
      return message.reply('DM içinde bu komutu çalıştıramam!');
    }

    if (command.args && !args.length) {
      let reply = `Argüman sağlamadınız, ${message.author}!`;
      if (command.usage) {
        reply += `\nDoğru kullanım: \`${config.botPrefix}${command.name} ${command.usage}\``;
      }
      return message.reply(reply);
    }

    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expiration = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expiration) {
        const timeLeft = ((expiration - now) / 1000).toFixed(1);
        return message.reply(
          `\`${command.name}\` komutunu tekrar kullanmak için ${timeLeft}s beklemelisin.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(err);
      message.reply('Bu komutu çalıştırırken bir hata oluştu!');
    }
  },
};
