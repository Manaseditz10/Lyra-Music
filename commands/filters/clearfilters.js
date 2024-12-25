const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class ClearFilters extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "clearfilters",
            aliases: ["clearfilter", "cf", "clear-filter"],
            cat: "filters",
            args: false,
            desc: "Sets the pop filter to the player",
            options: [],
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
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
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

        await player.clearFilters();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.filters} Cleared the filters from Player.`)
            ]
        })
    }
}