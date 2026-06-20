const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a 50-question Video Game trivia quiz!'),
    
    async execute(interaction) {
        await interaction.deferReply();

        // Your 50-question API URL
        const url = 'https://opentdb.com/api.php?amount=50&category=15&difficulty=medium&type=multiple';
        const response = await fetch(url);
        const data = await response.json();
        const questions = data.results;

        let score = 0;
        let index = 0;

        const sendQuestion = async () => {
            if (index >= questions.length) {
                return interaction.followUp(`**Quiz Complete!** You scored **${score}/${questions.length}**.`);
            }

            const q = questions[index];
            const decodedQuestion = q.question
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'")
                .replace(/&amp;/g, '&');
            const correctAnswer = q.correct_answer;

            const embed = new EmbedBuilder()
                .setTitle(`🎮 Video Game Trivia - Question ${index + 1}/50`)
                .setDescription(decodedQuestion)
                .setColor(0xe67e22) // Orange for Video Games
                .setFooter({ text: 'You have 45 seconds to answer!' });

            await interaction.followUp({ embeds: [embed] });

            const filter = m => m.author.id === interaction.user.id;
            // Increased time to 45 seconds per question since there are 50 questions
            const collector = interaction.channel.createMessageCollector({ filter, time: 45000, max: 1 });

            collector.on('collect', m => {
                if (m.content.toLowerCase() === correctAnswer.toLowerCase()) {
                    score++;
                    m.reply(`✅ Correct! The answer was **${correctAnswer}**.`);
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
