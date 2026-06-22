const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ttt')
        .setDescription('Play Tic-Tac-Toe against a friend!')
        .addUserOption(option => option.setName('opponent').setDescription('Choose an opponent').setRequired(true)),

    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        if (opponent.id === interaction.user.id) return interaction.reply("You can't play against yourself!");

        let board = Array(9).fill(null);
        let turn = interaction.user.id; // X goes first

        const createButtons = (disabled = false) => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                const row = new ActionRowBuilder();
                for (let j = 0; j < 3; j++) {
                    const index = i * 3 + j;
                    const label = board[index] === null ? '-' : board[index];
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`btn_${index}`)
                            .setLabel(label)
                            .setStyle(board[index] ? ButtonStyle.Secondary : ButtonStyle.Primary)
                            .setDisabled(disabled || board[index] !== null)
                    );
                }
                rows.push(row);
            }
            return rows;
        };

        await interaction.reply({ content: `Tic-Tac-Toe! <@${interaction.user.id}> (X) vs <@${opponent.id}> (O). Your turn: <@${turn}>`, components: createButtons() });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== turn) return i.reply({ content: "It's not your turn!", ephemeral: true });

            const index = parseInt(i.customId.split('_')[1]);
            board[index] = turn === interaction.user.id ? 'X' : 'O';
            turn = turn === interaction.user.id ? opponent.id : interaction.user.id;

            // Check for winner
            const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
            let winner = null;
            for (const [a, b, c] of winPatterns) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) winner = board[a] === 'X' ? interaction.user.username : opponent.username;
            }

            if (winner || !board.includes(null)) {
                await i.update({ content: winner ? `🎉 Winner: **${winner}**!` : "It's a draw!", components: createButtons(true) });
                collector.stop();
            } else {
                await i.update({ content: `Tic-Tac-Toe! Current turn: <@${turn}>`, components: createButtons() });
            }
        });
    },
};
