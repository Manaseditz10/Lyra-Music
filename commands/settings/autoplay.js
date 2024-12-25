const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Autoplay extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "autoplay",
            aliases: ["ap"],
            cat: "settings",
            args: false,
            desc: "Toggles autoplay of the player",
            options: [],
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true,
            }
        });
    }
    async run(message, args, prefix) {
        let settings = await this.client.db.getAutoPlay({ id: message.guild.id });

        if(!settings || !settings.enabled) {
            await this.client.db.enableAutoplay(message.guild.id);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.tick} Successfully **Enabled** Autoplay mode of the player`)
                ]
            });
        } else {
            await this.client.db.disableAutoplay(message.guild.id);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Successfully **Disabled** Autoplay mode of the player`)
                ]
            });
        }
    }
}