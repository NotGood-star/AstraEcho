const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtn')
        .setDescription('Start a Guess The Number game')
        .addIntegerOption(option => option.setName('min').setDescription('Minimum').setRequired(true))
        .addIntegerOption(option => option.setName('max').setDescription('Maximum').setRequired(true)),
    
    async execute(interaction) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');
        const secret = Math.floor(Math.random() * (max - min + 1)) + min;

        // 1. DM the owner
        try {
            await interaction.user.send(`🤫 **Game Secret:** The number is **${secret}**.`);
        } catch (err) {
            return await interaction.reply({ content: "I couldn't DM you! Please check your privacy settings.", ephemeral: true });
        }

        // 2. Embed for the channel
        const embed = new EmbedBuilder()
            .setTitle('🎲 Guess The Number')
            .setColor(0x3498db)
            .setDescription(`Game started! Guess a number between **${min}** and **${max}**.\n\n*The owner has been DMed the secret number.*`);

        await interaction.reply({ embeds: [embed] });

        // 3. Collector with specific logic
        const filter = m => !m.author.bot && !isNaN(m.content);
        const collector = interaction.channel.createMessageCollector({ filter, time: 600000 });

        collector.on('collect', m => {
            const guess = parseInt(m.content);
            if (guess === secret) {
                const winEmbed = new EmbedBuilder()
                    .setTitle('🎉 We have a winner!')
                    .setColor(0x2ecc71)
                    .setDescription(`**${m.author.username}** guessed correctly! The number was **${secret}**.`);
                
                interaction.followUp({ embeds: [winEmbed] });
                collector.stop();
            }
        });
    },
};
