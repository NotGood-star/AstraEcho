const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Try your luck with the slot machine!'),
    async execute(interaction) {
        const icons = ['🍒', '🍋', '🔔', '💎', '🍀'];
        const reel1 = icons[Math.floor(Math.random() * icons.length)];
        const reel2 = icons[Math.floor(Math.random() * icons.length)];
        const reel3 = icons[Math.floor(Math.random() * icons.length)];
        
        const isWin = reel1 === reel2 && reel2 === reel3;

        const embed = new EmbedBuilder()
            .setTitle('🎰 AstraEcho Slots')
            .setColor(isWin ? 0x2ecc71 : 0xe74c3c) // Green for win, Red for loss
            .setDescription(`Spinning... \n\n **[ ${reel1} | ${reel2} | ${reel3} ]**`)
            .addFields({ name: 'Result', value: isWin ? '🎉 Jackpot! You won!' : 'Better luck next time!' })
            .setFooter({ text: 'AstraEcho Game System' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
