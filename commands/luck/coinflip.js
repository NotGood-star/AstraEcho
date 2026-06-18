import { SlashCommandBuilder } from 'discord.js';
import { createGameEmbed } from '../../utils/embeds.js';

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin to see if you get Heads or Tails!'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const color = result === 'Heads' ? '#FFD700' : '#C0C0C0'; // Gold for Heads, Silver for Tails

        const embed = createGameEmbed(
            '🪙 Coin Flip',
            `The coin landed on: **${result}**!`,
            color
        );

        await interaction.reply({ embeds: [embed] });
    },
};
