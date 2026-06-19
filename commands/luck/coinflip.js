const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin and see the result!'),
    async execute(interaction) {
        // --- 1. Game Logic ---
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const color = result === 'Heads' ? 0x3498db : 0xe67e22; // Blue for Heads, Orange for Tails

        // --- 2. Build the Embed ---
        const embed = new EmbedBuilder()
            .setTitle('🪙 Coin Flip Result')
            .setColor(color)
            .setDescription(`The coin spins in the air...`)
            .addFields(
                { name: 'Landed on', value: `**${result}!**`, inline: true }
            )
            .setFooter({ text: 'AstraEcho Game System' })
            .setTimestamp();

        // --- 3. Reply with the Embed ---
        await interaction.reply({ embeds: [embed] });
    },
};
