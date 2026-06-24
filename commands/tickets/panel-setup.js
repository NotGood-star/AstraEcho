const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel-setup')
        .setDescription('Create a ticket panel')
        .addStringOption(o => o.setName('title').setDescription('Embed Title').setRequired(true))
        .addStringOption(o => o.setName('desc').setDescription('Embed Description').setRequired(true))
        // Define all 9 categories
        .addStringOption(o => o.setName('c1_t').setDescription('C1 Title').setRequired(true))
        .addStringOption(o => o.setName('c1_d').setDescription('C1 Desc').setRequired(true))
        .addStringOption(o => o.setName('c2_t').setDescription('C2 Title'))
        .addStringOption(o => o.setName('c2_d').setDescription('C2 Desc'))
        .addStringOption(o => o.setName('c3_t').setDescription('C3 Title'))
        .addStringOption(o => o.setName('c3_d').setDescription('C3 Desc'))
        .addStringOption(o => o.setName('c4_t').setDescription('C4 Title'))
        .addStringOption(o => o.setName('c4_d').setDescription('C4 Desc'))
        .addStringOption(o => o.setName('c5_t').setDescription('C5 Title'))
        .addStringOption(o => o.setName('c5_d').setDescription('C5 Desc'))
        .addStringOption(o => o.setName('c6_t').setDescription('C6 Title'))
        .addStringOption(o => o.setName('c6_d').setDescription('C6 Desc'))
        .addStringOption(o => o.setName('c7_t').setDescription('C7 Title'))
        .addStringOption(o => o.setName('c7_d').setDescription('C7 Desc'))
        .addStringOption(o => o.setName('c8_t').setDescription('C8 Title'))
        .addStringOption(o => o.setName('c8_d').setDescription('C8 Desc'))
        .addStringOption(o => o.setName('c9_t').setDescription('C9 Title'))
        .addStringOption(o => o.setName('c9_d').setDescription('C9 Desc')),

    async execute(interaction) {
        const options = [];
        // Loop through 1-9
        for (let i = 1; i <= 9; i++) {
            const title = interaction.options.getString(`c${i}_t`);
            const desc = interaction.options.getString(`c${i}_d`);
            if (title) {
                options.push({ label: title, value: title.toLowerCase().replace(/\s/g, '_'), description: desc || 'Support' });
            }
        }

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Select a category...')
                .addOptions(options)
        );

        const embed = new EmbedBuilder()
            .setTitle(interaction.options.getString('title'))
            .setDescription(interaction.options.getString('desc'))
            .setColor(0x00ff00);

        await interaction.reply({ embeds: [embed], components: [menu] });
    }
};
