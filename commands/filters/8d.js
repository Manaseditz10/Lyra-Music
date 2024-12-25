const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class EightD extends BaseCommand {
    constructor(client) {
        super(client, {
            name: '8d',
            aliases: ["eightD", "eight-d"],
            cat: "filters",
            args: false,
            desc: "Sets the 8d filter of the player",
            options: [],
            ownerOnly: false,
            usage: "[enable/disable]",
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true
            }
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guildId);

        if(!player) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
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

        await player.set8d();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Applied 8d filter to the Player.`)
            ]
        });
    }
}