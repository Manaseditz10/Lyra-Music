const { EmbedBuilder } = require("@discordjs/builders");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class ClearQueue extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "clearqueue",
            aliases: ['cq', "clear"],
            cat: "music",
            args: false,
            desc: "Cleares the queue of the player",
            options: [],
            ownerOnly: false,
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true
            }
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            });
        }


        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                ]
            }); 
        }

        if(!player.queue.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There are no Further Tracks in the Queue.`)
                ]
            });
        }

        player.queue.length = 0;

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Cleared the Queue.`)
            ]
        });
    }
}