const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close the current ticket'),

    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔒 Ticket Closing')
            .setDescription('This ticket will be deleted in 5 seconds.')
            .setColor(0xff0000)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        
        setTimeout(() => interaction.channel.delete().catch(console.error), 5000);
    }
};
