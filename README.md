# Gelişmiş Discord Bot Çerçevesi

Discord.js v14 ile oluşturulmuş, hem slash hem de prefix komutlarını destekleyen modüler bir bot altyapısı.

## Özellikler

- **Çift Komut Sistemi**: Modern slash komutları ve geleneksel prefix komutları bir arada.
- **Modüler Mimari**: Komutları ve eventleri ayrı klasörlerde düzenleyin.
- **Otomatik Kayıt**: Başlangıçta komutlar ve eventler otomatik yüklenir.
- **Cooldown Yönetimi**: Komut spam’ini önlemek için dahili cooldown sistemi.
- **Yardımcı Fonksiyonlar**: Embed oluşturma, zaman formatlama, izin kontrolü, sayfalama vb. araçlar.
- **Kategori Düzeni**: Komutlarınızı kategori klasörleri içinde tutun.
- **Hata Yakalama**: Sağlam try/catch blokları ve kullanıcı dostu geri bildirim.

## Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/sizin-kullanici-adiniz/proje-adi.git
   cd proje-adi
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Proje kökünde **config.json** dosyası oluşturun:
   ```json
   {
     "botToken": "YOUR_DISCORD_BOT_TOKEN",
     "botPrefix": "!",
     "botClientID": "YOUR_CLIENT_ID",
     "botServerID": "YOUR_GUILD_ID"
   }
   ```
4. Botu başlatın:
   ```bash
   node index.js
   ```

## Yapılandırma

Tüm kimlik bilgileri ve ayarlar **config.json** dosyasında saklanır. Örnek yapı:

```json
{
  "botToken": "MTE1...TOKEN...D9qpg",
  "botPrefix": ".",
  "botClientID": "1155152406762504264",
  "botServerID": "1156254697632567367"
}
```

- **botToken**: Botunuzun kimlik doğrulama token’ı.
- **botPrefix**: Prefix ile çağrılan komutlar için önek (örn. `.yardım`).
- **botClientID**: Uygulamanızın Client ID’si.
- **botServerID**: (İsteğe bağlı) Sadece belirli bir sunucuya özel slash komutları için Sunucu ID’si.


## Kullanım

### Slash Komut Örneği

```js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong ile yanıt verir'),
  cooldown: 5,
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
```

### Prefix Komut Örneği

```js
module.exports = {
  name: 'ping',
  description: 'Pong ile yanıt verir',
  aliases: ['p'],
  cooldown: 5,
  async execute(message) {
    await message.channel.send('Pong!');
  },
};
```

## Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Özellik eklemek, dokümantasyonu geliştirmek veya hataları düzeltmek İçin Ares Dev Gelebilirsin

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

