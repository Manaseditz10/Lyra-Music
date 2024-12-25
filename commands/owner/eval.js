const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { ButtonBuilder } = require("discord.js");

module.exports = class Eval extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "eval",
            aliases: ['jsk', 'punit'],
            cat: "owner",
            desc: "evals the javascript statement",
            ownerOnly: true,
            args: true,
            usage: "<args>",
            options: [{
                name: "query",
                required: true,
                description: "takes the arguement to be executed",
                type: 3
            }],
            // voiceSettings: {}
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!args.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Please provide me some Arguement`)
                ]
            });
        }

        let query = args.join(" ");

        let res;

        try{
            res = await eval(query);
            res = require("util").inspect(res,{ depth: 0 })
        } catch(e) {
            res = require("util").inspect(e,{ depth: 0 });
        }


        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                .setDescription(`\`\`\`js\n${res}\`\`\``)
            ],
            components: [
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setLabel("Delete")
                    .setStyle(4).setCustomId("owner_del")
                ])
            ]
        });
    }
}