const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play a game of Hangman!'),
    async execute(interaction) {
        const words = ['discord', 'javascript', 'developer', 'adventure', 'keyboard'];
        const word = words[Math.floor(Math.random() * words.length)];
        let guessedLetters = [];
        let lives = 6;
        let revealedWord = Array(word.length).fill('_');

        const getDisplay = () => revealedWord.join(' ');

        const embed = new EmbedBuilder()
            .setTitle('hangman')
            .setDescription(`Word: \`${getDisplay()}\`\nLives: ${lives}\nGuessed: ${guessedLetters.join(', ')}`)
            .setColor(0x3498db);

        await interaction.reply({ embeds: [embed] });

        const filter = m => m.author.id === interaction.user.id && m.content.length === 1;
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async m => {
            const guess = m.content.toLowerCase();
            if (guessedLetters.includes(guess)) return m.reply("You already guessed that!");

            guessedLetters.push(guess);

            if (word.includes(guess)) {
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === guess) revealedWord[i] = guess;
                }
                m.reply("Good guess!");
            } else {
                lives--;
                m.reply("Wrong letter!");
            }

            // Update the embed
            embed.setDescription(`Word: \`${getDisplay()}\`\nLives: ${lives}\nGuessed: ${guessedLetters.join(', ')}`);
            await interaction.editReply({ embeds: [embed] });

            if (!revealedWord.includes('_')) {
                collector.stop('win');
            } else if (lives === 0) {
                collector.stop('loss');
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === 'win') interaction.followUp(`🎉 You won! The word was **${word}**.`);
            else if (reason === 'loss') interaction.followUp(`💀 Game over! The word was **${word}**.`);
            else interaction.followUp(`⏰ Time's up! The word was **${word}**.`);
        });
    },
};
