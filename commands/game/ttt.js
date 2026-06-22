const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ttt')
        .setDescription('Play Tic-Tac-Toe against a friend!')
        .addUserOption(option => option.setName('opponent').setDescription('Choose an opponent').setRequired(true)),

    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        if (opponent.id === interaction.user.id) return interaction.reply({ content: "You can't play against yourself!", ephemeral: true });

        let board = Array(9).fill(null);
        let turn = interaction.user.id;

        const getBoardDisplay = () => {
            let display = '';
            for (let i = 0; i < 9; i++) {
                if (i % 3 === 0 && i !== 0) display += '\n';
                display += board[i] === null ? '⬜' : (board[i] === 'X' ? '❌' : '⭕');
            }
            return display;
        };

        const createButtons = (disabled = false) => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                const row = new ActionRowBuilder();
                for (let j = 0; j < 3; j++) {
                    const index = i * 3 + j;
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`btn_${index}`)
                            .setLabel(board[index] ? ' ' : ' ') // Keep visual clean
                            .setEmoji(board[index] === 'X' ? '❌' : (board[index] === 'O' ? '⭕' : '➖'))
                            .setStyle(board[index] ? ButtonStyle.Secondary : ButtonStyle.Primary)
                            .setDisabled(disabled || board[index] !== null)
                    );
                }
                rows.push(row);
            }
            return rows;
        };

        const embed = new EmbedBuilder()
            .setTitle('🎮 Tic-Tac-Toe')
            .setDescription(`**${interaction.user.username}** (❌) vs **${opponent.username}** (⭕)\n\n${getBoardDisplay()}`)
            .setColor(0x0099ff);

        await interaction.reply({ embeds: [embed], components: createButtons() });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            // Acknowledge the interaction immediately to stop the error
            await i.deferUpdate();

            if (i.user.id !== turn) return; // Only current player can move

            const index = parseInt(i.customId.split('_')[1]);
            board[index] = turn === interaction.user.id ? 'X' : 'O';
            turn = turn === interaction.user.id ? opponent.id : interaction.user.id;

            const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
            let winner = null;
            for (const [a, b, c] of winPatterns) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    winner = board[a] === 'X' ? interaction.user.username : opponent.username;
                }
            }

            const nextEmbed = new EmbedBuilder()
                .setTitle('🎮 Tic-Tac-Toe')
                .setColor(winner ? 0x00ff00 : 0x0099ff)
                .setDescription(winner ? `🎉 **${winner} wins!**\n\n${getBoardDisplay()}` : `**${interaction.user.username}** (❌) vs **${opponent.username}** (⭕)\n\n${getBoardDisplay()}`);

            if (winner || !board.includes(null)) {
                await interaction.editReply({ embeds: [nextEmbed], components: createButtons(true) });
                collector.stop();
            } else {
                await interaction.editReply({ embeds: [nextEmbed], components: createButtons() });
            }
        });
    },
};
