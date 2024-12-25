const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Bass extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "bassboost",
            aliases: ['bass'],
            cat: "filters",
            args: false,
            desc: "applies bass to the player",
            options: [],
            ownerOnly: false,
            // usage: 
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

        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }

        await player.setBass();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.tick} Applied BassBoost to the Player.`)
            ]
        });
    }
}