const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Resume extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "resume",
            aliases: [],
            cat: "music",
            desc: "resumes the player",
            args: false,
            options: [],
            ownerOnly: false,
            voiceSettings: {
                vc: true,
                sameVc: true,
                player:true,
            }
        })
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.cliente.emoji.cross} There is no Player in this Guild.`)
                ]
            });
        }

        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }

        if(!player.isPaused()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Player is not Paused.`)
                ]
            })
        }

        await player.resume();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.resume} *Resumed* the Player.`)
            ]
        });
    }
}