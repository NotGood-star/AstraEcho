const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel-setup')
        .setDescription('Create a custom ticket panel')
        .addStringOption(option => option.setName('title').setDescription('Embed Title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Embed Description').setRequired(true))
        // Category 1
        .addStringOption(o => o.setName('c1_title').setDescription('Category 1 Title').setRequired(true))
        .addStringOption(o => o.setName('c1_desc').setDescription('Category 1 Desc').setRequired(true))
        // Category 2
        .addStringOption(o => o.setName('c2_title').setDescription('Category 2 Title'))
        .addStringOption(o => o.setName('c2_desc').setDescription('Category 2 Desc'))
        // Add more as needed (c3, c4, c5, c6...)
        ,

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        const options = [];
        for (let i = 1; i <= 2; i++) { // Increase this loop to 6 if you add more options
            const t = interaction.options.getString(`c${i}_title`);
            const d = interaction.options.getString(`c${i}_desc`);
            if (t) options.push({ label: t, value: t.toLowerCase().replace(/\s/g, '_'), description: d || 'Support' });
        }

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('Select a category...')
                .addOptions(options)
        );

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(0x00ff00);

        await interaction.reply({ embeds: [embed], components: [menu] });
    }
};
