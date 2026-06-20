const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('russian-roulette')
        .setDescription('Test your luck with a 1 in 6 chance!'),
    async execute(interaction) {
        const isDead = Math.floor(Math.random() * 6) === 0;

        const embed = new EmbedBuilder()
            .setTitle('🔫 Russian Roulette')
            .setDescription(isDead ? '🔥 **BOOM!** The gun fired.' : '🚬 *Click.* You are safe... for now.')
            .setColor(isDead ? 0xe74c3c : 0x2ecc71);

        await interaction.reply({ embeds: [embed] });
    },
};
