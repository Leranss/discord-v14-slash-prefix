const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands', 'prefix');

  // Sadece klasörleri al
  const commandFolders = fs
    .readdirSync(commandsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      // name ve execute kontrolü
      if (!command.name || typeof command.execute !== 'function') {
        console.log(`[✗] ${file} dosyasında 'name' veya 'execute' özelliği eksik.`);
        continue;
      }

      // Komutu ve alias'ları kaydet
      client.prefixCommands.set(command.name, command);
      if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          client.prefixCommands.set(alias, command);
        }
      }

      console.log(`[✓] Prefix komutu başarıyla yüklendi: ${command.name}`);
    }
  }
};
