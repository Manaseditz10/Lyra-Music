const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Stop extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "stop",
            aliases: [],
            args: false,
            options: [],
            desc: "stops the player",
            cat: "music",
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
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player for this Guild.`)
                ]
            });
        }

        if(player.queue.length) {
            await player.stop();
        } else {
            await player.skip();
        }

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Stopped the Player.`)
            ]
        });
    }
    async exec(interaction) {
        let player = this.client.music.playersMap.get(interaction.guild.id);

        if(!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.stop} There is no Player for ths Guild.`)
                ]
            });
        }

        if(player.queue.length) {
            await player.stop();
        } else {
            await player.skip();
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emji.stop} Stopped the Player.`)
            ]
        });
    }
}