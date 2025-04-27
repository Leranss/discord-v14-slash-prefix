const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Sunucudan bir kullanıcıyı yasaklar',
  aliases: ['banla', 'yasakla'],
  usage: '<kullanıcı> [sebep] [gün]',
  args: true,
  guildOnly: true,
  cooldown: 5,
  
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('Üyeleri yasaklama yetkin yok!');
    }
    
    if (!args.length) {
      return message.reply(`Lütfen banlanacak bir kullanıcı belirt!\nKullanım: \`${client.prefix}${this.name} ${this.usage}\``);
    }
    
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    
    if (!target) {
      return message.reply('Geçerli bir kullanıcı etiketleyin veya kullanıcı ID\'si girin!');
    }
    
    args.shift();
    
    let deleteMessageDays = 0;
    if (args.length > 0 && !isNaN(args[args.length - 1]) && Number(args[args.length - 1]) >= 0 && Number(args[args.length - 1]) <= 7) {
      deleteMessageDays = parseInt(args.pop());
    }
    
    const reason = args.length ? args.join(' ') : 'Sebep belirtilmedi.';
    
    const targetMember = await message.guild.members.fetch(target.id).catch(() => null);
    
    if (targetMember) {
      if (!targetMember.bannable) {
        return message.reply('Bu kullanıcıyı banlayamıyorum. Benden daha yüksek yetkilere sahip olabilir.');
      }
      
      if (
        message.member.id !== message.guild.ownerId && 
        message.member.roles.highest.position <= targetMember.roles.highest.position
      ) {
        return message.reply('Bu kullanıcıyı banlayamazsın. Yetkisi seninle aynı ya da daha yüksek.');
      }
    }
    
    try {
      await message.guild.members.ban(target.id, {
        deleteMessageDays,
        reason: `${message.author.tag}: ${reason}`
      });
      
      const embed = new EmbedBuilder()
        .setTitle('Kullanıcı Yasaklandı')
        .setDescription(`**${target.tag}** sunucudan yasaklandı.`)
        .addFields(
          { name: 'Yasaklayan', value: `${message.author.tag}`, inline: true },
          { name: 'Sebep', value: reason, inline: true },
          { name: 'Silinen Mesaj Günleri', value: `${deleteMessageDays} gün`, inline: true }
        )
        .setColor('#FF0000')
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return message.reply(`Kullanıcıyı yasaklama işlemi başarısız oldu: ${error.message}`);
    }
  },
};
