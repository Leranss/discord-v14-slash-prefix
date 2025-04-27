const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı sunucudan yasakla')
    .addUserOption(option => 
      option.setName('kullanici')
        .setDescription('Yasaklanacak kullanıcı')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('sebep')
        .setDescription('Yasağın sebebi')
        .setRequired(false))
    .addIntegerOption(option => 
      option.setName('gun')
        .setDescription('Silinecek mesaj gün sayısı (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  cooldown: 5,

  async execute(interaction, client) {
    const hedefKullanici = interaction.options.getUser('kullanici');
    const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
    const mesajSilmeGun = interaction.options.getInteger('gun') || 0;
    
    const hedefUye = await interaction.guild.members.fetch(hedefKullanici.id).catch(() => null);
    
    if (!hedefUye) {
      return interaction.reply({
        content: 'Bu kullanıcı sunucuda bulunamadı.',
        ephemeral: true
      });
    }
    
    if (!hedefUye.bannable) {
      return interaction.reply({
        content: 'Bu kullanıcıyı yasaklayamıyorum. Benden daha yüksek yetkilere sahip olabilir.',
        ephemeral: true
      });
    }
    
    if (
      interaction.member.id !== interaction.guild.ownerId && 
      interaction.member.roles.highest.position <= hedefUye.roles.highest.position
    ) {
      return interaction.reply({
        content: 'Bu kullanıcıyı yasaklayamazsın. Rolü seninle aynı veya daha yüksek.',
        ephemeral: true
      });
    }
    
    await interaction.deferReply();
    
    try {
      await interaction.guild.members.ban(hedefKullanici.id, {
        deleteMessageDays: mesajSilmeGun,
        reason: `${interaction.user.tag}: ${sebep}`
      });
      
      const embed = new EmbedBuilder()
        .setTitle('Kullanıcı Yasaklandı')
        .setDescription(`**${hedefKullanici.tag}** sunucudan yasaklandı.`)
        .addFields(
          { name: 'Yasaklayan', value: `${interaction.user.tag}`, inline: true },
          { name: 'Sebep', value: sebep, inline: true },
          { name: 'Silinen Mesaj Günleri', value: `${mesajSilmeGun} gün`, inline: true }
        )
        .setColor('#FF0000')
        .setTimestamp();
      
      return interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `Kullanıcı yasaklanırken bir hata oluştu: ${error.message}`
      });
    }
  },
};
