module.exports = {
    name: 'test', 
    description: 'Botun çalışıp çalışmadığını test eder.', 
    usage: '!test', 
    cooldown: 3, 
  
    async execute(message, args, client) {
      message.reply('✅ Bot çalışıyor!');
    }
  };
  