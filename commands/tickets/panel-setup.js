const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel-setup')
        .setDescription('Create the ticket panel'),

    async execute(interaction) {
        // Read your JSON file
        const data = JSON.parse(fs.readFileSync('./tickets.json', 'utf8'));

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Select a category...')
                .addOptions(data.categories) // This now grabs ALL categories from the JSON
        );

        const embed = new EmbedBuilder()
            .setTitle("Support Tickets")
            .setDescription("Select a category below to open a ticket.")
            .setColor(0x00ff00);

        await interaction.reply({ embeds: [embed], components: [menu] });
    }
};
