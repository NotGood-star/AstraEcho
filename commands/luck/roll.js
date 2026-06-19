const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a 6-sided die!')
        .addIntegerOption(option => 
            option.setName('sides')
                .setDescription('Number of sides (default is 6)')
                .setMinValue(2)
                .setMaxValue(100)),
    async execute(interaction) {
        // Get user input or default to 6
        const sides = interaction.options.getInteger('sides') || 6;
        const result = Math.floor(Math.random() * sides) + 1;

        // Build the Embed
        const embed = new EmbedBuilder()
            .setTitle('🎲 Dice Roll')
            .setColor(0x9b59b6) // A nice purple color for dice
            .setDescription(`You rolled a **${sides}**-sided die!`)
            .addFields(
                { name: 'Result', value: `You rolled a **${result}**!`, inline: true }
            )
            .setFooter({ text: 'AstraEcho Game System' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
