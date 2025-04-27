const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'yardım',
  description: 'Mevcut tüm komutları veya belirli bir komut hakkında bilgi listeler',
  aliases: ['komutlar', 'komut', 'yardımcı'],
  usage: '[komut adı]',
  cooldown: 3,
  
  async execute(message, args, client) {
    const prefix = client.prefix;

    if (!args.length) {
      const categories = new Map();

      client.prefixCommands.forEach(command => {
        if (!command || typeof command !== 'object' || typeof command.name !== 'string') return;

        const category = command.category || 'Kategorilenmemiş';

        if (!categories.has(category)) {
          categories.set(category, []);
        }

        categories.get(category).push(command);
      });

      const fields = [];

      categories.forEach((commands, category) => {
        commands = commands.filter(cmd => cmd && typeof cmd.name === 'string');
        commands.sort((a, b) => a.name.localeCompare(b.name));

        const commandList = commands.map(cmd => `\`${prefix}${cmd.name}\` - ${cmd.description || 'Açıklama yok'}`).join('\n');

        fields.push({ name: `${category} [${commands.length}]`, value: commandList });
      });

      const embed = new EmbedBuilder()
        .setTitle('Mevcut Komutlar')
        .setDescription(`Belirli bir komut hakkında bilgi almak için \`${prefix}yardım [komut]\` kullanabilirsiniz.`)
        .addFields(fields)
        .setColor('#0099ff')
        .setFooter({ text: `Toplam ${client.prefixCommands.size} prefix komutu` })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    // Eğer belirli bir komut aranıyorsa
    const commandName = args[0].toLowerCase();
    const command = client.prefixCommands.get(commandName)
      || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      return message.reply(`Geçerli bir komut değil!`);
    }

    const fields = [];

    if (command.aliases?.length) {
      fields.push({ name: 'Alternatifler', value: command.aliases.join(', '), inline: true });
    }

    if (command.usage) {
      fields.push({ name: 'Kullanım', value: `${prefix}${command.name} ${command.usage}`, inline: true });
    }

    fields.push({ name: 'Bekleme Süresi', value: `${command.cooldown || 3} saniye`, inline: true });

    const embed = new EmbedBuilder()
      .setTitle(`Komut: ${command.name}`)
      .setDescription(command.description || 'Açıklama bulunamadı.')
      .addFields(fields)
      .setColor('#0099ff')
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};
