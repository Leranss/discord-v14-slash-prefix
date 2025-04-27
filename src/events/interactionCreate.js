const { Collection } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    if (!interaction.isChatInputCommand()) return;


    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      console.error(`[!] ${interaction.commandName} adında bir komut bulunamadı.`);
      return;
    }

    if (!command.data) {
      console.error(`[!] ${interaction.commandName} komutunun 'data' özelliği bulunamadı.`);
      return interaction.reply({ 
        content: 'Bu komut doğru şekilde yapılandırılmamış!', 
        ephemeral: true 
      });
    }

    const { cooldowns } = client;

   
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 3) * 1000; 

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({ 
          content: `\`${command.data.name}\` komutunu tekrar kullanabilmek için ${timeLeft.toFixed(1)} saniye daha beklemelisin.`,
          ephemeral: true 
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {

      
      if (typeof command.execute !== 'function') {
        console.error(`[!] ${interaction.commandName} komutunun bir 'execute' fonksiyonu bulunamadı.`);
        return interaction.reply({ 
          content: 'Bu komut doğru şekilde uygulanmamış!', 
          ephemeral: true 
        });
      }

      // Komutu çalıştır
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[HATA] ${interaction.commandName} komutunun çalıştırılması sırasında hata oluştu:`, error);

      const errorMessage = { 
        content: 'Bu komutu çalıştırırken bir hata oluştu!', 
        ephemeral: true 
      };

 
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      } catch (followUpError) {
        console.error('Hata mesajı gönderilemedi:', followUpError);
      }
    }
  },
};
