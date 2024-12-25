const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Skip extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "skip",
            aliases: ['s'],
            cat: "music",
            args: false,
            desc: "Skips the currently playing track",
            ownerOnly: false,
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true,
            }
        });
    }

    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            });
        } else {
            if(player.isPlaying()) {
                await player.skip();

                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.skip} Skipped the Track.`)
                    ]
                });
            } else {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                    ]
                });
            }
        }
    }
    async exec(interaction) {
        let player = this.client.music.playersMap.get(interaction.guildId);

        if(!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            });
        }

        if(player.isPlaying()) {
            await player.skip();

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.skip} Skipped the Track.`)
                ]
            });
        } else {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }
    }
}