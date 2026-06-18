import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = `file://${path.join(commandsPath, file)}`;
        const command = (await import(filePath)).default;
        commands.push(command.data.toJSON());
    }
}

// Replace these with your actual IDs
const CLIENT_ID = '1517031078777327706';
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
