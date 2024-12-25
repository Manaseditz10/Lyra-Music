const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Shuffle extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "shuffle",
            aliases: [],
            options: [],
            ownerOnly: false,
            args: false,
            desc: "shuffles the queue of the player",
            cat: "music",
            // usag
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true
            }
        })
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            })
        }

        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }

        if(!player.queue.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Insufficient Queue Length.`)
                ]
            });
        }

        player.queue = player.queue.sort(() => Math.random() - 0.5);

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji["tick"]} Shuffled the Queue.`)
            ]
        });
    }
}