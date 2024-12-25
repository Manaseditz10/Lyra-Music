const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Ignore extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "ignore",
            aliases: ["ign"],
            cat: "settings",
            args: true,
            options: [],
            desc: "Configures the ignore module of the bot",
            usage: "<add/remove/mod/admin>"
        });
    }
    async run(message, args, prefix) {
        let setting = await this.client.db.getGuildData({ id: message.guild.id });

        let ignoreModule = setting?.ignoreModule;

        let ignoredChannels = ignoreModule.ignoredChannels;

        if(!args.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Invalid Args. Use: \`ignore <add/remove/bypass>\``)
                ]
            });
        }

        let opt = args[0].toLowerCase();

        if(opt === 'add') {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => {});

            if(!channel) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Channel.`)
                    ]
                });
            }

            if(channel.type !== 0) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Valid Text Channel.`)
                    ]
                });
            }

            if(ignoredChannels?.includes(channel.id)) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Channel ${channel} is Already in my Ignore List.`)
                    ]
                });
            }


            await this.client.db.addIgnore(message.guild,channel);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.tick} Successfully **Added** ${channel} to my Ignore list.`)
                ]
            })
        } else if(opt === "remove") {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => {});

            if(!channel) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide me a Channel.`)
                    ]
                })
            }

            if(channel.type !== 0) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Expected a Text Channel.`)
                    ]
                })
            }

            if(!ignoredChannels.includes(channel.id)) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Channel ${channel} is not in my Ignore List.`)
                    ]
                });
            }

            await this.client.db.removeIgnore(message.guild, channel);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.tick} Successfully **Removed** ${channel} from my Ignore list.`)
                ]
            });
        }
        else if(opt === "bypass") {
            let opts = args[1];
            if(!opts) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Expected a Arguement.\nOptions: <admin/mod>`)
                    ]
                })
            }


            if(opts.toLowerCase() === "admin" | opts.toLowerCase() === "admin") {
                let data = await this.client.db.adminBypass(message.guild.id);

                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji[data.adminBypass ? "tick" : "cross"]} Successfully **${data.adminBypass ? "Enabled" : "Disabled"}** the Admin Bypass.`)
                    ]
                });
            } else if(opts.toLowerCase() === "mods" || opts.toLowerCase() === "mod") {
                let data = await this.client.db.modsBypass(message.guildId);

                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji[data.modsBypass ? "tick" : "cross"]} Successfully **${data.modsBypass ? "Enabled" : "Disabled"}** the Mods Bypass.`)
                    ]
                });
            }
        } else {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Expected a Valid Arguement.\nOptions: \`<add/remove/bypass>\``)
                ]
            });
        }
    }
}