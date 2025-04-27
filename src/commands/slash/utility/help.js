const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Mevcut tüm komutları veya belirli bir komut hakkında bilgi listeler')
    .addStringOption(option => 
      option.setName('komut')
        .setDescription('Belirli bir komut hakkında bilgi al')
        .setRequired(false)),
  cooldown: 3,
  
  async execute(interaction, client) {
    const commandName = interaction.options.getString('komut');
    
    if (commandName) {
      const command = client.slashCommands.get(commandName);
      
      if (!command) {
        return interaction.reply({
          content: `\`${commandName}\` adlı komut bulunamadı!`,
          ephemeral: true
        });
      }
      
      const embed = new EmbedBuilder()
        .setTitle(`Komut: ${command.data.name}`)
        .setDescription(command.data.description)
        .addFields(
          { name: 'Bekleme Süresi', value: `${command.cooldown || 3} saniye`, inline: true }
        )
        .setColor('#0099ff')
        .setTimestamp();
      
      return interaction.reply({ embeds: [embed] });
    }
    
    const categories = new Map();
    
    client.slashCommands.forEach(command => {
      const category = command.data.name === 'yardım' ? 'Yardım' : 
        command.category || command.data.name.split('/').slice(-2, -1)[0] || 'Kategorilenmemiş';
      
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      
      categories.get(category).push({
        name: command.data.name,
        description: command.data.description
      });
    });
    
    const fields = [];
    
    categories.forEach((commands, category) => {
      commands.sort((a, b) => a.name.localeCompare(b.name));
      
      const commandList = commands.map(cmd => `\`/${cmd.name}\` - ${cmd.description}`).join('\n');
      
      fields.push({ name: `${category} [${commands.length}]`, value: commandList });
    });
    
    const embed = new EmbedBuilder()
      .setTitle('Mevcut Komutlar')
      .setDescription(`Belirli bir komut hakkında bilgi almak için \`/yardım <komut>\` kullan.\nBotun prefix'i: \`${client.prefix}\` (metin komutları için).`)
      .addFields(fields)
      .setColor('#0099ff')
      .setFooter({ text: `Toplam ${client.slashCommands.size} komut` })
      .setTimestamp();
    
    return interaction.reply({ embeds: [embed] });
  },
};
