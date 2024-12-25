const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Pause extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "pause",
            aliases: [],
            cat: 'music',
            options: [],
            desc: "pauses the player",
            args: false,
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
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            })
        }

        if(player.isPaused()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Player is Already Paused.`)
                ]
            }) 
        }

        await player.pause();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.pause} *Paused* the Player.`)
            ]
        });
    }
}