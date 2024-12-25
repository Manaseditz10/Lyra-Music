const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Karaoke extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "karaoke",
            aliases: [],
            cat: "filters",
            desc: "applies karaoke filter to the player",
            args: false,
            options: [],
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
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player for this Guild.`)
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

        await player.setKaraoke();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.tick} Applied karaoke filter to the player.`)
            ]
        });
    }
}