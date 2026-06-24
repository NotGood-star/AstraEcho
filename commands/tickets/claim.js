const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claim a ticket'),

    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        }

        await interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true });

        // Creating the Embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket Claimed')
            .setDescription(`This ticket has been claimed by ${interaction.user}`)
            .setColor(0x00ff00)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
