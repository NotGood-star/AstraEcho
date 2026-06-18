import { EmbedBuilder } from 'discord.js';

export const createGameEmbed = (title, description, color = '#0099ff') => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: 'AstraEcho Game System' });
};
