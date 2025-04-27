module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[✓] ${client.user.tag} artık çevrimiçi!`);
    console.log(`[i] Toplam ${client.guilds.cache.size} sunucu ve ${client.users.cache.size} kullanıcıya hizmet veriliyor.`);

    client.user.setPresence({
      activities: [{ name: `${client.prefix}help | /help`, type: 3 }],
      status: 'online',
    });
  },
};
