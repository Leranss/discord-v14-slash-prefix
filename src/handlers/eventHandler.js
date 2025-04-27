const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    const handler = (...args) => event.execute(...args, client);

    if (event.once) {
      client.once(event.name, handler);
    } else {
      client.on(event.name, handler);
    }

    console.log(`[✓] ${event.name} etkinliği başarıyla yüklendi!`);
  }
};
