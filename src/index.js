// index.js
const fs = require('fs');
const path = require('path');
const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes,
    EmbedBuilder,
} = require('discord.js');

// Load environment variables
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;


// === Temporary poll storage ===
const polls = new Map(); // messageId => { question, options, votes: Map<userId, index> }

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Load slash commands
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(__dirname, 'commands', file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Register commands
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  try {
    console.log("🔁 Refreshing commands (global)...");
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });
    console.log("✅ Globally registered commands");
  } catch (error) {
    console.error(error);
  }
})();

// Bot ready event
client.once('ready', () => {
    console.log(`✅ Pollr logged in as ${client.user.tag}`);
});

// Handle commands and buttons
client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            const response = await command.execute(interaction);
            if (interaction.commandName === 'poll' && response) {
                const { message, question, options } = response;
                polls.set(message.id, {
                    question,
                    options,
                    votes: new Map(),
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
        }
    }

    if (interaction.isButton()) {
        const messageId = interaction.message.id;
        const poll = polls.get(messageId);
        if (!poll) return interaction.reply({ content: '❌ Poll not found.', ephemeral: true });

        const userId = interaction.user.id;
        if (poll.votes.has(userId)) {
            return interaction.reply({ content: '⚠️ You already voted in this poll.', ephemeral: true });
        }

        const optionIndex = parseInt(interaction.customId.replace('poll_option_', ''));
        poll.votes.set(userId, optionIndex);

        const count = new Array(poll.options.length).fill(0);
        for (const vote of poll.votes.values()) count[vote]++;
        const totalVotes = poll.votes.size;

        const colors = ['🟥', '🟧', '🟨', '🟩', '🟦'];
        const result = poll.options.map((option, i) => {
            const votes = count[i];
            const percent = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
            const full = Math.round(percent / 10);
            const empty = 10 - full;
            const bar = colors[i % colors.length].repeat(full) + '⬜'.repeat(empty);
            return `**${option}**\n${bar} ${percent}% (${votes} vote${votes !== 1 ? 's' : ''})`;
        }).join('\n\n');

        const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription(`**${poll.question}**\n\n${result}`);

        await interaction.update({ embeds: [updatedEmbed] });
    }
});

client.login(token);