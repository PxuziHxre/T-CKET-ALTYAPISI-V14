const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    run: async (client, message, args) => {
        // Sadece bot sahibinin veya yöneticinin bu komutu kullanabilmesi için kontrol
        if (message.author.id !== require('./config.js').ownerId) {
            return message.reply("Bu komutu sadece bot sahibi kullanabilir!");
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'VxbalV888 | Destek System' })
            .setTitle('🎫 Destek Talep Paneli')
            .setDescription(
                `🎁 **Çekiliş Kazandım.**\n` +
                `**Çekiliş Kazandıysanız Ticket Açıp SS Göndeririniz.**\n\n` +
                `🛠️ **Destek Sorun İçin.**\n` +
                `**Şikayetiniz Olunca Açınız.**\n\n` +
                `⚠️ **Altyapı Çalınmış.**\n` +
                `**Altyapımızı Çalıp Kullanananları SS Atınız.**\n\n` +
                `*Aşağıdaki butona basarak size özel bir destek kanalı oluşturabilirsiniz.*`
            )
            .setColor('#00ffea')
            .setFooter({ text: 'VxbalV888 | Destek System', iconURL: client.user.avatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_olustur')
                .setLabel('Destek Talebi Oluştur')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🗞️')
        );

        // Komut mesajını silip paneli gönderir
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [embed], components: [row] });
    }
};
