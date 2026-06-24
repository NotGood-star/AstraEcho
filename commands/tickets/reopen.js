const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reopen')
        .setDescription('Reopen a ticket (reset permissions)'),

    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        }
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
        await interaction.reply('Ticket permissions reset.');
    }
};
