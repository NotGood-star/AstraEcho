const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wordList = require('./words.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scramble')
        .setDescription('Unscramble the word to win!')
        .addStringOption(option => 
            option.setName('difficulty')
                .setDescription('Select the difficulty')
                .setRequired(true)
                .addChoices(
                    { name: 'Easy (Short words)', value: 'easy' },
                    { name: 'Hard (Long words)', value: 'hard' }
                )),

    async execute(interaction) {
        const difficulty = interaction.options.getString('difficulty');
        
        // Filter words based on difficulty
        const filteredWords = difficulty === 'easy' 
            ? wordList.filter(w => w.length <= 7) 
            : wordList.filter(w => w.length > 7);

        if (filteredWords.length === 0) return interaction.reply("No words found for this difficulty!");

        const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        
        // Scramble function
        const scramble = (w) => w.split('').sort(() => Math.random() - 0.5).join('');
        let scrambled = scramble(word);
        while (scrambled === word) { scrambled = scramble(word); }

        const embed = new EmbedBuilder()
            .setTitle('🔀 Word Scramble')
            .setDescription(`Difficulty: **${difficulty.toUpperCase()}**\n\nUnscramble this word: **${scrambled.toUpperCase()}**`)
            .setColor(0x2ecc71)
            .setFooter({ text: 'You have 30 seconds to answer!' });

        await interaction.reply({ embeds: [embed] });

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

        collector.on('collect', m => {
            if (m.content.toLowerCase() === word.toLowerCase()) {
                m.reply(`🎉 **Correct!** The word was **${word}**.`);
            } else {
                m.reply(`❌ Wrong! The word was **${word}**.`);
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp(`⏰ Time's up! The word was **${word}**.`);
            }
        });
    },
};
