const { SlashCommandBuilder } = require('discord.js');
const package = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about the Pollr bot.'),
  async execute(interaction) {
    await interaction.reply(`ℹ️ **Pollr Bot Info**

- Version: ${package.version}
- Developed by: OP Devs
- Repository: https://github.com/schmidtoctavio/pollr-bot`);
  },
};
