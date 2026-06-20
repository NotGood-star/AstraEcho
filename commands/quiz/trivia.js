const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a Video Game trivia quiz!'),
    
    async execute(interaction) {
        await interaction.deferReply();

        const url = 'https://opentdb.com/api.php?amount=50&category=15&difficulty=medium&type=multiple';
        const response = await fetch(url);
        const data = await response.json();
        const questions = data.results;

        let score = 0;
        let index = 0;

        const sendQuestion = async () => {
            if (index >= questions.length) {
                return interaction.followUp(`**Quiz Complete!** Final score: **${score}/${questions.length}**`);
            }

            const q = questions[index];
            const decodedQuestion = q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');
            const correctAnswer = q.correct_answer;

            const embed = new EmbedBuilder()
                .setTitle(`🎮 Question ${index + 1}/50`)
                .setDescription(decodedQuestion)
                .setColor(0xe67e22)
                .setFooter({ text: 'Reply with your answer. Type "stop" to end the quiz.' });

            await interaction.followUp({ embeds: [embed] });

            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', m => {
                if (m.content.toLowerCase() === 'stop') {
                    m.reply(`🛑 Quiz ended. You scored **${score}**.`);
                    collector.stop('user_stopped');
                    return;
                }

                if (m.content.toLowerCase() === correctAnswer.toLowerCase()) {
                    score++;
                    m.reply(`✅ Correct! The answer was **${correctAnswer}**. Type anything to continue or "stop" to quit.`);
                } else {
                    m.reply(`❌ Wrong! The answer was **${correctAnswer}**. Type anything to continue or "stop" to quit.`);
                }
                
                // Instead of immediately auto-asking, we wait for the next message
                // or just pause here. The current setup waits for the next turn.
                index++;
                sendQuestion();
            });

            collector.on('end', (collected, reason) => {
                if (collected.size === 0 && reason !== 'user_stopped') {
                    interaction.followUp(`⏰ Time's up! The answer was **${correctAnswer}**. Quiz timed out.`);
                }
            });
        };

        sendQuestion();
    },
};
