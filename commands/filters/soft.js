const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Soft extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "soft",
            aliases: [],
            options: [],
            desc: "applies soft filter to the player",
            args: false,
            cat: "filters",
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
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }
        await player.setSoft();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Applied Soft filter to the Player.`)
            ]
        });
    }
}