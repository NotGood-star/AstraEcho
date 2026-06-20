const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lucky-number')
        .setDescription('Guess a number between 1 and 10!')
        .addIntegerOption(option => 
            option.setName('guess')
                .setDescription('Your lucky number')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)),
    async execute(interaction) {
        const userGuess = interaction.options.getInteger('guess');
        const winningNumber = Math.floor(Math.random() * 10) + 1;
        const isWin = userGuess === winningNumber;

        const embed = new EmbedBuilder()
            .setTitle('🍀 Lucky Number Draw')
            .setColor(isWin ? 0x2ecc71 : 0x9b59b6)
            .setDescription(`You guessed **${userGuess}**.`)
            .addFields(
                { name: 'Winning Number', value: `The lucky number was **${winningNumber}**!`, inline: true }
            )
            .setFooter({ text: 'AstraEcho Game System' });

        await interaction.reply({ embeds: [embed] });
    },
};
