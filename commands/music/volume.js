const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Volume extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "volume",
            aliases: ["vol"],
            cat: "music",
            args: true,
            desc: 'configures the volume of the player',
            options: [],
            ownerOnly: false,
            usage: '<number>',
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
        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji["cross"]} No Track is Queued.`)
                ]
            });
        }

        if(!args.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Please provide me a Arguement.`)
                ]
            });
        }

        if(isNaN(args[0])) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Valid Number.`)
                ]
            });
        }

        let num = Number(args[0]);

        if(num < 0 || num > 200) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Invalid Range of Volume!\nValid range: \`0\` to \`200\``)
                ]
            });
        }

        if(num === player.getVolume()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.emoji.cross).setDescription(`${this.client.emoji.cross} Provided Number is same as Player's current Volume.`)
                ]
            });
        }

        await player.setVol(num);

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.tick} Updated the Player's Volume to: \`${num}\``)
            ]
        })
    }
}