const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { ActionRowBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");

module.exports = class Invite extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "invite",
            desc: "gets the user the ivnite link for the bot",
            aliases: ["inv"],
            args: false,
            cat: "info",
            options: [],
            ownerOnly: false,
        })
    }
    async run(message, args, prefix) {
        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`${this.client.emoji.info} Click the button Below.`)
            ],
            components: [
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setStyle(5).setLabel("Invite").setURL(`https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&integration_type=0&scope=bot+applications.commands`)
                ])
            ]
        });
    }
}