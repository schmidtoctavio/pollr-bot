const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('privacy')
    .setDescription('View the privacy policy of the Pollr bot.'),
  async execute(interaction) {
    await interaction.reply(`🔐 **Privacy Policy**

Pollr does not store any personal data or poll results. All interactions are ephemeral and only visible within Discord. No tracking or logging of user actions is performed.

For more information, visit: https://github.com/schmidtoctavio/pollr-bot`);
  },
};
