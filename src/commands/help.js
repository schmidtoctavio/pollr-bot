const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with using the Pollr bot.'),
  async execute(interaction) {
    await interaction.reply(`📘 **Pollr Bot Help**

**/poll** - Create a new poll with up to 5 options.
**/help** - Display this help message.
**/privacy** - View our privacy statement.
**/info** - Get information about this bot.

🔗 Visit our repo: https://github.com/schmidtoctavio/pollr-bot`);
  },
};
