const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reopen')
        .setDescription('Reopen a ticket (reset permissions)'),

    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        }

        // Reset permissions
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });

        const embed = new EmbedBuilder()
            .setTitle('🔄 Ticket Reopened')
            .setDescription('Ticket permissions have been reset and the ticket is now open for further discussion.')
            .setColor(0xffff00)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
