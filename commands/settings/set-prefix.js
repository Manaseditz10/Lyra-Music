const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class SetPrefix extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'set-prefix',
            aliases: ['prefix', 'setprefix'],
            cat: "settings",
            desc: "Changes the prefix for the server",
            options: [{
                name: 'prefix',
                description: "takes the prefix input",
                required: true,
                type: 3
            }],
            usage: "<prefix>",
            args: true,
        }) 
    }
    async run(message, args, prefix) {
        if(args[1]) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Prefix can't contain any trail spaces.`)
                ]
            });
        }

        if(args[0].length > 3) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Expected Prefix Length is less than 3.`)
                ]
            });
        }

        await this.client.db.updatePrefix({ id: message.guild.id, prefix: args[0] });

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Guild's Prefix has been changed to: ${args[0]}`)
            ]
        });
    }
}