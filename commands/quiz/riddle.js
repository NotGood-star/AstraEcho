const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('riddle')
        .setDescription('Challenge your mind with a classic riddle!'),
    async execute(interaction) {
        const riddles = [
            { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "echo" },
            { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", a: "map" },
            { q: "What is seen in the middle of March and April that can’t be seen at the beginning or end of either month?", a: "r" },
            { q: "What has keys but can’t open locks?", a: "piano" },
            { q: "What has to be broken before you can use it?", a: "egg" },
            { q: "I’m tall when I’m young, and I’m short when I’m old. What am I?", a: "candle" },
            { q: "What month of the year has 28 days?", a: "all" },
            { q: "What is full of holes but still holds water?", a: "sponge" },
            { q: "What question can you never answer yes to?", a: "are you asleep" },
            { q: "What is always in front of you but can’t be seen?", a: "future" },
            { q: "There’s a one-story house in which everything is yellow. Yellow walls, yellow doors, yellow furniture. What color are the stairs?", a: "none" },
            { q: "What can you break, even if you never pick it up or touch it?", a: "promise" },
            { q: "What goes up but never comes down?", a: "age" },
            { q: "A man who was outside in the rain without an umbrella or hat didn’t get a single hair on his head wet. Why?", a: "he was bald" },
            { q: "What word is spelled incorrectly in every dictionary?", a: "incorrectly" },
            { q: "What has many teeth but cannot bite?", a: "comb" },
            { q: "What can you catch, but not throw?", a: "cold" },
            { q: "What is so fragile that saying its name breaks it?", a: "silence" },
            { q: "I have one eye but no head. What am I?", a: "needle" },
            { q: "What gets wetter the more it dries?", a: "towel" }
        ];

        const riddle = riddles[Math.floor(Math.random() * riddles.length)];

        const embed = new EmbedBuilder()
            .setTitle('🧩 Daily Riddle')
            .setColor(0xf1c40f)
            .setDescription(riddle.q)
            .setFooter({ text: 'You have 60 seconds to answer!' });

        await interaction.reply({ embeds: [embed] });

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', m => {
            // Using .includes for better flexibility
            if (m.content.toLowerCase().includes(riddle.a)) {
                m.reply(`🎉 **Correct!** You are a genius.`);
            } else {
                m.reply(`❌ Not quite! The answer was: **${riddle.a}**.`);
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp(`⏰ Time's up! The answer was: **${riddle.a}**.`);
            }
        });
    },
};
