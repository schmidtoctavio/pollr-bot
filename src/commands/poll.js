const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll with up to 5 options')
    .addStringOption(opt =>
      opt.setName('question').setDescription('The poll question').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('option1').setDescription('First option').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('option2').setDescription('Second option').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('option3').setDescription('Third option (optional)').setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('option4').setDescription('Fourth option (optional)').setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('option5').setDescription('Fifth option (optional)').setRequired(false)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = [];

    for (let i = 1; i <= 5; i++) {
      const option = interaction.options.getString(`option${i}`);
      if (option) options.push(option);
    }

    const embed = new EmbedBuilder()
      .setTitle('📊 Poll')
      .setDescription(`**${question}**`)
      .setColor(0x5865F2);

    const row = new ActionRowBuilder();

    options.forEach((option, index) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_option_${index}`)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    return { message, question, options };
  }
};