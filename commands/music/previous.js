const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Previous extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'previous',
            aliases: ['prev'],
            cat: "music",
            args: false,
            desc: "plays the previous track",
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
                    .setDescription(`${this.client.emoji.cross} There is no Player for this Guild.`)
                ]
            });
        }

        if(player.previous) {
            player.queue.unshift(player.previous);
            await player.skip();
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Playing the Previous Track`)
                ]
            });
        } else {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Previous Track in the Queue.`)
                ]
            });
        }
    }
}