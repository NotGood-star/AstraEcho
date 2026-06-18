import { SlashCommandBuilder } from 'discord.js';
import { createGameEmbed } from '../../utils/embeds.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks if AstraEcho is responsive.'),
    async execute(interaction) {
        // Create the embed using our helper
        const embed = createGameEmbed(
            '🏓 Pong!',
            `Latency is ${Date.now() - interaction.createdTimestamp}ms.`
        );

        await interaction.reply({ embeds: [embed] });
    },
};
