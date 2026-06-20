const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a 10-question Anime & Manga trivia quiz!'),
    
    async execute(interaction) {
        await interaction.deferReply();

        // API URL for 10 Anime questions, Medium difficulty
        const url = 'https://opentdb.com/api.php?amount=10&category=31&difficulty=medium&type=multiple';
        const response = await fetch(url);
        const data = await response.json();
        const questions = data.results;

        let score = 0;
        let index = 0;

        const sendQuestion = async () => {
            if (index >= questions.length) {
                return interaction.followUp(`**Quiz Over!** Your final score: **${score}/${questions.length}**`);
            }

            const q = questions[index];
            // Decode HTML entities
            const decodedQuestion = q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');
            const correctAnswer = q.correct_answer;

            const embed = new EmbedBuilder()
                .setTitle(`Anime Trivia - Question ${index + 1}`)
                .setDescription(decodedQuestion)
                .setColor(0x9b59b6)
                .setFooter({ text: 'Reply with your answer!' });

            await interaction.followUp({ embeds: [embed] });

            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', m => {
                if (m.content.toLowerCase() === correctAnswer.toLowerCase()) {
                    score++;
                    m.reply(`✅ Correct!`);
                } else {
                    m.reply(`❌ Wrong! The correct answer was **${correctAnswer}**.`);
                }
                index++;
                sendQuestion();
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp(`⏰ Time's up! The answer was **${correctAnswer}**.`);
                    index++;
                    sendQuestion();
                }
            });
        };

        sendQuestion();
    },
};
