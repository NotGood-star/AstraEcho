const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtn')
        .setDescription('Start a Guess The Number game')
        .addIntegerOption(option => option.setName('min').setDescription('Minimum').setRequired(true))
        .addIntegerOption(option => option.setName('max').setDescription('Maximum').setRequired(true)),
    async execute(interaction) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');
        const secret = Math.floor(Math.random() * (max - min + 1)) + min;

        // DM the owner
        await interaction.user.send(`🤫 The secret number is: **${secret}**`);
        
        // Reply in channel
        await interaction.reply(`🎲 Game started! Guess a number between ${min} and ${max}.`);

        // Create a collector to listen for guesses in the channel
        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({ filter, time: 600000 }); // 10 min limit

        collector.on('collect', m => {
            const guess = parseInt(m.content);
            if (guess === secret) {
                m.reply(`🎉 **${m.author.username}** guessed it! The number was ${secret}.`);
                collector.stop();
            }
        });
    },
};
