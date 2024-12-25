const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Blacklist extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "blacklist",
            aliases: ["bl"],
            cat: "owner",
            options: [],
            desc: "blacklists a server or a user",
            ownerOnly: true,
            args: true,
            usage: "<user/server>",
            // voiceSettings: {}
        })
    }
    async run(message, args, prefix) {
        let opt = args[0];

        if(!opt) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} Valid Arguement Expected.\nAvailable Options: \`user\`, \`server\``)
                ]
            });
        }

        if(opt.toLowerCase() === "user") {
            let user = message.mentions.users.first() || this.client.users.cache.get(args[1]) || await this.client.users.fetch(args[1]).catch(() => {});
            
            if(!user) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide me a Valid User.`)
                    ]
                });
            }

            let data = await this.client.db.blacklistUser(user);
            data = data.blacklistedUsers.includes(user.id);
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji[data ? "tick" : "cross"]} Successfully ${data ? "Added" : "Removed"} *${user}* ${data ? "to" : "from"} the Blacklist.`)
                ]
            });
        } else if(opt.toLowerCase() === "server") {
            if(!args[1]) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Please provide me a Arguement.`)
                    ]
                })
            }
            let guild = this.client.guilds.cache.get(args[1]);
            if(!guild) {
                guild = await this.client.guilds.fetch(args[1]).catch((e) => {});
            }
            if(!guild) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Guild Not Found.`)
                    ]
                });
            }

            let data = await this.client.db.blacklistGuild(guild);
            data = data.blacklistedServers.includes(guild.id);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji[data ? "tick" : "cross"]} Successfully ${data ? "Added" : "Removed"} *${guild.name}* ${data ? "to" : "from"} Blacklist.`)
                ]
            });
        }
    }
}