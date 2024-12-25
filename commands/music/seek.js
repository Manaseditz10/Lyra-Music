const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const ms = require('ms');

module.exports = class Seek extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'seek',
            aliases: [],
            desc: "Seeks the player to a time",
            options: [{
                name: "time",
                type: 3,
                description: "takes the time input",
                required: true
            }],
            ownerOnly: false,
            args: false,
            cat: "music",
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
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }

        let q = args[0];
        if(!q) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Provide me a time.`)
                ]
            });
        }

        q = ms(q);

        if(!q) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Valid Time.`)
                ]
            })
        }

        if(q < 0 || q > player.current.info.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Provided time is Out of the Bounds.`)
                ]
            })
        }

        await player.seek(q);

        return await message.react(`${this.client.emoji.tick}`);
    }
}