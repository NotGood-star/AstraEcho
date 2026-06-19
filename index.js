const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
require('dotenv').config();

// --- 1. Keep-Alive Web Server ---
const app = express();
app.get('/', (req, res) => res.send('AstraEcho is running!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server is active.'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// --- 2. Load Commands (Recursive) ---
const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            }
        }
    }
};

loadCommands(path.join(__dirname, 'commands'));

// --- 3. Client Ready & Auto-Register ---
client.once(Events.ClientReady, async (c) => {
    console.log(`🚀 AstraEcho is online as ${c.user.tag}!`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        const commands = client.commands.map(cmd => cmd.data.toJSON());
        
        await rest.put(
            Routes.applicationCommands('1517031078777327706'),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Registration Error:', error);
    }
});

// --- 4. Interaction Handling ---
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
