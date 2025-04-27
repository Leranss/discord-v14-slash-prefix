const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = async (client) => {
  const commands = [];
  const commandsPath = path.join(__dirname, '..', 'commands', 'slash');

  // Komut dosyalarını oku ve yükle
  const commandFolders = fs.readdirSync(commandsPath)
    .filter(folder => fs.statSync(path.join(commandsPath, folder)).isDirectory());

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.slashCommands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`[✓] Slash komutu yüklendi: ${command.data.name}`);
      } else {
        console.log(`[✗] ${filePath} dosyasındaki komut "data" veya "execute" özelliğine sahip değil.`);
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(config.botToken);

  try {
    console.log('[⌛] Uygulama (/) komutları yenileniyor...');


    const route = config.botServerID
      ? Routes.applicationGuildCommands(config.botClientID, config.botServerID)
      : Routes.applicationCommands(config.botClientID);

    await rest.put(route, { body: commands });
    console.log('[✓] Uygulama (/) komutları başarıyla yenilendi.');
  } catch (error) {
    console.error('[✗] Komutlar yenilenirken bir hata oluştu:', error);
  }
};
