const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scratch-card')
        .setDescription('Scratch your virtual card to win!'),
    async execute(interaction) {
        // Define possible symbols and rewards
        const symbols = ['💰', '💎', '🍒', '🍋', '❌'];
        
        // Pick 3 symbols at random
        const card = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        // Check for a win (all 3 must match)
        const isWin = card[0] === card[1] && card[1] === card[2];
        const winMessage = isWin ? "JACKPOT! You matched all three!" : "Not a winner, try again!";

        const embed = new EmbedBuilder()
            .setTitle('🎟️ Virtual Scratch Card')
            .setColor(isWin ? 0xf1c40f : 0x7f8c8d) // Gold for win, Grey for loss
            .setDescription(`You scratched the card... \n\n **[ ${card[0]} | ${card[1]} | ${card[2]} ]**`)
            .addFields({ name: 'Result', value: winMessage })
            .setFooter({ text: 'AstraEcho Game System' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
