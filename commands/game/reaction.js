const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction')
        .setDescription('Test your reaction time!'),
    
    async execute(interaction) {
        // Create a button that starts as disabled
        const button = new ButtonBuilder()
            .setCustomId('reaction_button')
            .setLabel('WAIT FOR IT...')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const row = new ActionRowBuilder().addComponents(button);
        const startTime = Date.now();

        await interaction.reply({
            content: 'Get ready... click when the button turns green!',
            components: [row]
        });

        // Random delay between 2 and 5 seconds
        const delay = Math.floor(Math.random() * 3000) + 2000;

        setTimeout(async () => {
            button.setLabel('CLICK ME NOW!')
                  .setStyle(ButtonStyle.Success)
                  .setDisabled(false);

            const rowActive = new ActionRowBuilder().addComponents(button);
            await interaction.editReply({
                content: 'GO!',
                components: [rowActive]
            });
            
            const reactTime = Date.now();

            const collector = interaction.channel.createMessageComponentCollector({ time: 5000, max: 1 });

            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    const duration = Date.now() - reactTime;
                    await i.update({
                        content: `✅ Reaction time: **${duration}ms**!`,
                        components: []
                    });
                }
            });
        }, delay);
    },
};
