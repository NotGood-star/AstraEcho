const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close the current ticket'),

    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        }
        await interaction.reply('Closing channel in 5 seconds...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
};
