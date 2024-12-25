const { EmbedBuilder, ChannelType, Embed } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { createSetup, deleteSetup } = require("../../assets/functions");

module.exports = class Setup extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "setup",
            aliases: ['set'],
            cat: "settings",
            args: false,
            desc: "configures setup in the guild",
            options: [],
            ownerOnly: false,
            usage: "<create/delete/fix>",
        })
    }
    async run(message, args, prefix) {
        if(!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Expected Some Arguements.\nOptions Available: \`create\`, \`delete\`, \`fix\``)
                ]
            });
        }


        let opt = args[0].toLowerCase();

        if(opt === "create") {
            let guildSettings = await this.client.db.getGuildData({ id: message.guild.id });

            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch((e) => { return undefined }) || undefined;

            if(!channel) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Valid Channel.`)
                    ]
                });
            }

            if(channel.type !== ChannelType.GuildText) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Expected a Valid Text Channel.`)
                    ]
                });
            }

            if(guildSettings?.setupSettings?.messageId && guildSettings?.setupSettings.channelId) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Setup Already exists at: <#${guildSettings.setupSettings.channelId}>`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("ViewChannel")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`View Channel\` Permissions in ${channel}`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("SendMessages")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`Send Messages\` Permissions in ${channel}`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("ReadMessageHistory")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`Read Message History\` Permissions in ${channel}`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("UseExternalEmojis")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`Use External Emojis\` Permissions in ${channel}`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("EmbedLinks")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`Embed Links\` Permissions in ${channel}`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("ManageChannels")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`Manage Channels\` Permissions in ${channel}`)
                    ]
                });
            }

            if(!message.guild.members.me.permissionsIn(channel).has("ManageMessages")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} I don't Have \`Manage Messages\` Permissions in ${channel}`)
                    ]
                });
            }

            try{
                await createSetup(this.client, message.guild, channel);
            } catch(e) {
                console.log(e);
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Failed to create Setup. Kindly Contact the Support.`)
                    ]
                });
            }

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Created a Setup at: ${channel}`)
                ]
            });
        }

        else if(opt === "delete") {
            let guildSettings = await this.client.db.getGuildData({ id: message.guild.id });

            if(guildSettings?.setupSettings?.messageId && guildSettings?.setupSettings?.channelId) {
                try{
                    await deleteSetup(this.client, message.guild);
                } catch(e) {
                    return await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Couldn't Delete the Setup. Kindly Contact the Support.`)
                        ]
                    });
                }
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully Deleted the Setup.`)
                    ]
                });
            } else {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Setup in this Guild currently.`)
                    ]
                });
            }
        } else if(opt === "fix") {
            let guildSettings = await this.client.db.getGuildData({ id: message.guild.id });

            if(!guildSettings?.setupSettings?.messageId && !guildSettings?.setupSettngs?.channelId) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.warn} Setup seems Fine.`)
                    ]
                });
            }

            else {
                let msg = await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`Fixing Setup.....`)
                    ]
                });

                let channel = guildSettings.setupSettings.channelId;
                let message = guildSettings.setupSettings.messageId;

                channel = await channel.fetch();
                message = await message.fetch();

                if(!channel || !message) {
                    await deleteSetup(this.client, message.guild);
                    return await msg.edit({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Setup Fixed. Now Create a new setup.`)
                        ]
                    }).catch(async e => {
                        return await message.channel.send({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Setup Fixed. Now Create a new setup.`)
                            ]
                        });
                    });
                } else {
                    return await msg.edit({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.warn} Setup seems Fine.`)
                        ]
                    }).catch(async (e) => {
                        return await message.channel.send({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.warn} Setup seems Fine.`)
                            ]
                        })
                    });
                }
            }
        }
    }
}