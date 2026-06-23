const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel-setup')
        .setDescription('Create a ticket support panel')
        .addStringOption(option => option.setName('title').setDescription('The title of the ticket embed').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description of the ticket embed').setRequired(true)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Select an issue type...')
                .addOptions([
                    { label: 'General Support', value: 'support', description: 'Ask a general question' },
                    { label: 'Report User', value: 'report', description: 'Report a rule breaker' },
                    { label: 'Feedback', value: 'feedback', description: 'Give us feedback' }
                ])
        );

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(0x00ff00)
            .setFooter({ text: 'Select an option to open a ticket' });

        await interaction.reply({ embeds: [embed], components: [menu] });
    }
};
