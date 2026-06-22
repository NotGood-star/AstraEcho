const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ttt')
        .setDescription('Play Tic-Tac-Toe against a friend!')
        .addUserOption(option => option.setName('opponent').setDescription('Who to play against?').setRequired(true)),
    
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        if (opponent.id === interaction.user.id) return interaction.reply("You can't play against yourself!");
        
        // You would create 9 buttons here, tracking the board in an array:
        // [0,0,0,
        //  0,0,0,
        //  0,0,0]
        
        await interaction.reply({ content: `Tic-Tac-Toe: ${interaction.user} vs ${opponent}` });
        // Use a MessageComponentCollector to listen for button clicks from the two players!
    }
};
