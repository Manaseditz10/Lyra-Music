const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const BaseEvent = require("../../assets/baseEvent");
const { playSetup } = require("../../assets/functions");

module.exports = class MessageListener extends BaseEvent {
    constructor(client) {
        super(client,{
            name: "MessageListener",
            eventName: "messageCreate"
        })
    }
    async run(message) {

        if(message.author.bot) return;
        if(message.channel.type === 1) return;

        let prefix;

        let guildData = await this.client.db.getGuildData({ id: message.guild.id });
        if(guildData) prefix = guildData.prefix;
        else prefix = this.client.config.prefix;

        let setupSettings = guildData?.setupSettings;
        let channelSettings = setupSettings?.channelId;
        let messageSettings = setupSettings?.messageId;

        if(channelSettings && channelSettings === message.channel.id) {
            try{
                await playSetup({
                    client: this.client,
                    message,
                    guild: message.guild,
                    channelId: channelSettings,
                    messageId: messageSettings,
                });

                return;

            } catch(e) { console.log(e); return; };
        }

        if(message.content === `<@${this.client.user.id}>`) {
            let em = new EmbedBuilder().setColor(this.client.config.color)
            .setDescription(`Lyra is a destined crystal quality ${this.client.emoji.music} audio parsing musical bot,\nfor all your freshing moods and entertainment.\n\n${this.client.emoji.info} Guild Prefix: \`${prefix}\`\n${this.client.emoji.settings} Voice State: ${this.client.music.playersMap.get(message.guild.id) ? this.client.music.playersMap.get(message.guild.id).voiceChannel : "Not Connected."}`);

            let row = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setLabel("Invite Me").setStyle(5).setURL(`https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&integration_type=0&scope=bot+applications.commands`),
                new ButtonBuilder().setLabel("Support").setStyle(5).setURL(`${this.client.config.serverLink}`),
                new ButtonBuilder().setLabel("Help").setStyle(4).setCustomId(`help-button`)
            ]);

            return await message.channel.send({
                embeds: [em],
                components: [row]
            }).catch((e) => {});
        }

        let reg = new RegExp(`<@${this.client.user.id}>`);
        let pre = message.content.match(reg) ? message.content.match(reg)[0] : prefix;
        let np = [];
        let npData = await this.client.db.getNoPrefixList();
        if(npData && npData.array.length) {
            for(let i = 0; i < npData.array.length; i++) {
                np.push(npData.array[i]);
            }
        }

        let blacklistedUsers = npData?.blacklistedUsers;
        let blacklistedServers = npData?.blacklistedServers;

        if(blacklistedServers?.includes(message.guild.id)) return;
        if(blacklistedUsers?.includes(message.author.id)) return;

        if(!np.includes(message.author.id)) {
            if(!message.content.startsWith(pre)) return;
        }

        let args = !np.includes(message.author.id) ? message.content.slice(pre.length).trim().split(/ +/) : message.content.startsWith(pre) ? message.content.slice(pre.length).trim().split(/ +/) : message.content.trim().split(/ +/);

        let commandName = args.shift().toLowerCase();
        
        let command = this.client.commands.get(commandName);
        if(!command) {
            this.client.commands.forEach((cmd) => {
                if(cmd.aliases && cmd.aliases.length && cmd.aliases.includes(commandName)) {
                    command = cmd;
                }
            });
        }

        if(command) {
            if(!message.guild.members.me.permissionsIn(message.channel).has("ViewChannel")) {
                return message.author.send({
                    content: `${this.client.emoji.cross} I dom't Have \`View Channel\` Permissions in the Channel.`
                }).catch((e) => {});
            }

            if(!message.guild.members.me.permissionsIn(message.channel).has("SendMessages")) {
                return message.author.send({
                    content: `${this.client.emoji.cross} I don't Have \`Send Messages\` Permissions in the Channel.`
                }).catch((e) => {});
            }

            if(!message.guild.members.me.permissionsIn(message.channel).has("ReadMessageHistory")) {
                return message.channel.send({
                    content: `${this.client.emoji.cross} I don't Have \`Read Message History\` Permissions in the Channel.`
                })
            }

            if(!message.guild.members.me.permissionsIn(message.channel).has("EmbedLinks")) {
                return message.channel.send({
                    content: `${this.client.emoji.cross} I don't Have \`Embed Links\` Permissions in the Channel.`
                })
            }

            if(!message.guild.members.me.permissionsIn(message.channel).has("UseExternalEmojis")) {
                return message.channel.send({
                    content: `${this.client.emoji.cross} I don't Have \`Use External Emojis\` Permissions in the Channel.`
                });
            }


            let ignoreModule = guildData?.ignoreModule;

            if(ignoreModule?.ignoredChannels?.includes(message.channel.id)) {

                let adminBypass = ignoreModule.adminBypass;
                let modsBypass = ignoreModule.modsBypass;

                if( (adminBypass && modsBypass && !message.member.permissions.has("ModerateMembers") && !message.member.permissions.has("Administrator") ) || (adminBypass && !modsBypass && !message.member.permissions.has("Administrator")) || (!adminBypass && modsBypass && !message.member.permissions.has("ModerateMembers")) || (!adminBypass && !modsBypass)) {
                    return await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.warn} You cannot use any of my commands in this Channel.`)
                        ]
                    });
                }
            }

            if(command.ownerOnly) {
                if(!this.client.config.owners.includes(message.author.id))
                    return message.channel.send({
                        content: `${this.client.emoji.cross} You are not Allowed to Execute this Command.`
                    });
            }

            if(command.voiceSettings !== undefined) {
                if(command.voiceSettings.vc && !message.member.voice?.channel) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ]
                    });
                }

                if(command.voiceSettings.sameVc && message.guild.members.me.voice.channel && message.member.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ]
                    });
                }

                if(command.voiceSettings.player) {
                    let player = this.client.music.playersMap.has(message.guild.id);
                    if(!player) {
                        return message.channel.send({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                            ]
                        })
                    }
                }
            }

            if(command.category === "settings" && !message.member.permissions.has("ManageGuild")) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} You don't Have \`Manage Guild\` Permissions to Execute this Command.`)
                    ]
                });
            }
    
            command.run(message,args,prefix).catch((e) => {
                console.log(e);
            }).then(async () => {
                let web = new WebhookClient({ url : this.client.config.webhooks.cmd });
                await web.send({
                    content : `\`\`\`js\nMessage Command Execution Logs\n\nCommand Name: ${command.name}\nCommand Author: ${message.author.globalName ?? message.author.username}\nGuild name: ${message.guild.name}\n Command Channel Name: ${message.channel.name}\`\`\``
                }).catch((e) => { });
            });
        }

        else {
            this.client.dokdo.run(message);
        }
    }
}