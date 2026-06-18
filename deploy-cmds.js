const { REST, Routes } = require('discord.js');
require('dotenv').config(); // Note: This will pull from Render's env vars

const commands = [];
// This reads your commands folder again to register them
// (You'll add logic here to loop through your command files)

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        // Replace CLIENT_ID with your bot's ID
        await rest.put(Routes.applicationCommands('1517031078777327706'), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
