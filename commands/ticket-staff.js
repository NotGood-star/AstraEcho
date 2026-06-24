const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-staff')
        .setDescription('Set the staff role for ticket pings')
        .addRoleOption(o => o.setName('role').setDescription('Select the staff role').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        
        config.staffRoleId = role.id;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        await interaction.reply({ content: `✅ Staff role set to: ${role.name}`, ephemeral: true });
    }
};
