const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('./config.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} Aktif! Ticket sistemi hazır.`);
});

// Buton Etkileşimi (Ticket Açma Kısmı)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'ticket_olustur') {
        await interaction.deferReply({ ephemeral: true });

        const guild = client.guilds.cache.get(config.sunucuId);
        if (!guild) return interaction.editReply({ content: "Sunucu bulunamadı, ayarları kontrol edin." });

        // Kişiye özel gizli kanal oluşturma
        const kanal = await guild.channels.create({
            name: `talebi-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: config.kategoriId,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel], // Herkese kapat
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Ticket açana aç
                },
                {
                    id: config.ownerId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory], // Bot sahibine aç
                }
            ],
        });

        // Ticket içi bilgilendirme mesajı ve Kapatma Butonu
        const embed = new EmbedBuilder()
            .setTitle('Destek Talebi Açıldı')
            .setDescription(`Hoş geldin ${interaction.user}! Yetkililerimiz sizinle en kısa sürede ilgilenecektir.\nTalebi kapatmak için aşağıdaki butona basabilirsiniz.`)
            .setColor('#2F3136')
            .setFooter({ text: 'VxbalV888 | Destek System' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_kapat')
                .setLabel('Talebi Kapat')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒')
        );

        await kanal.send({ embeds: [embed], components: [row] });
        await interaction.editReply({ content: `Ticket kanalınız başarıyla açıldı: ${kanal}`, ephemeral: true });
    }

    // Ticket Kapatma Butonu İşlevi
    if (interaction.customId === 'ticket_kapat') {
        await interaction.reply({ content: 'Bu kanal 5 saniye içinde siliniyor...' });
        setTimeout(() => {
            interaction.channel.delete().catch(() => {});
        }, 5000);
    }
});

// Komut Dinleyici (ticketkomut.js dosyasını tetikler)
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ticket') {
        const ticketKomut = require('./ticketkomut.js');
        ticketKomut.run(client, message, args);
    }
});

client.login(config.token);
