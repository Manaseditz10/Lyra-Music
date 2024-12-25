const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, BaseSelectMenuBuilder, StringSelectMenuBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class HelpCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "help",
            aliases: ["h"],
            args: false,
            cat: "info",
            desc: "Shows the help menu and helping command for the Bot",
            options: [{
                name: "command",
                type: 3,
                description: "gets the command name you are looking help for",
                required: false,
            }]
        });
    }
    async run(message, args, prefix) {
        if(!args.length) {
            let em1 = new EmbedBuilder().setColor(this.client.config.color).setDescription(`Lyra is a destined crystal quality audio parsing musical bot,\nfor all your freshing moods and entertainment.`).addFields([
                {
                    name: 'Command Categories',
                    value: `${this.client.emoji.music} Music\n${this.client.emoji.filters} Filters\n${this.client.emoji.settings} Settings\n${this.client.emoji.info} Information\n${this.client.emoji.owner} Owner\n${this.client.emoji.allCommands} All Commands`
                }
            ]).setAuthor({
                name: `${this.client.user.username}'s Help menu`,
                iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
            }).setFooter({
                text: `Made with 💘 by Lyra Developers`,
                iconURL: message.author.displayAvatarURL({ forceStatic: false })
            });

            let row1 = new ActionRowBuilder().addComponents([
                new StringSelectMenuBuilder().setCustomId("help-menu").setPlaceholder("Select Categories").setDisabled(false).addOptions([
                    {
                        label: "Home",
                        emoji: `${this.client.emoji.home}`,
                        value: "home-help"
                    },
                    {
                        label: "Music",
                        emoji: `${this.client.emoji.music}`,
                        value: "music-help",
                    },
                    {
                        label: "Filters",
                        emoji: `${this.client.emoji.filters}`,
                        value: "filters-help"
                    },
                    {
                        label: "Settings",
                        emoji:  `${this.client.emoji.settings}`,
                        value: "settings-help"
                    },
                    {
                        label: "Information",
                        emoji: `${this.client.emoji["info"]}`,
                        value: "info-help"
                    },
                    {
                        label: "Owner",
                        emoji: `${this.client.emoji.owner}`,
                        value: "owner-help"
                    },
                    {
                        label: "Playlist",
                        emoji: `${this.client.emoji.playlist}`,
                        value: "playlist-help"
                    },
                    {
                        label: "All Commands",
                        emoji: `${this.client.emoji.allCommands}`,
                        value: "allCmds-help"
                    }
                ])
            ]);

            let row2 = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setLabel("Home").setCustomId("home-help-menu").setStyle(2).setDisabled(true),
                new ButtonBuilder().setLabel("Command List").setCustomId("cmd-list-help").setStyle(2),
                new ButtonBuilder().setLabel("Button Menu").setCustomId("btn-menu-help").setStyle(2)
            ]);

            return await message.channel.send({
                embeds: [em1],
                components: [row2, row1]
            });
            
            // let embed = new EmbedBuilder().setColor(this.client.config.color).setAuthor({
            //     name: `${this.client.user.username}'s Help Menu`,
            //     iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
            // }).setDescription(`Lyra is a destined crystal quality audio parsing musical bot,\nfor all your freshing moods and entertainment.`)
            // .addFields([
            //     {
            //         name: `Music **[${musicCommands.length}]**`,
            //         value: `${musicCommands.map(cmd => `\`${cmd.name.slice(0,1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
            //     },
            //     {
            //         name: `Filters **[${filterCommands.length}]**`,
            //         value: `${filterCommands.map(cmd => `\`${cmd.name.slice(0,1).toUpperCase()+cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
            //     },
            //     {
            //         name: `Information **[${infoCommands.length}]**`,
            //         value: `${infoCommands.map(cmd => `\`${cmd.name.slice(0,1).toUpperCase()+cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
            //     },
            //     {
            //         name: `Settings **[${settingCommands.length}]**`,
            //         value: `${settingCommands.map(cmd => `\`${cmd.name.slice(0,1).toUpperCase()+cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
            //     },
            //     {
            //         name: `Owner **[${ownerCommands.length}]**`,
            //         value: `${ownerCommands.map(cmd => `\`${cmd.name.slice(0,1).toUpperCase()+cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
            //     }
            // ]).setThumbnail(message.guild.iconURL({ forceStatic: false })).setFooter({
            //     text: `Made with 💘 by Lyra Developers`,
            //     iconURL: message.author.displayAvatarURL({ forceStatic: false })
            // });


            // return await message.channel.send({
            //     embeds: [embed]
            // });
        } else {
            let cmd;

            cmd = this.client.commands.get(args[0].toLowerCase());
            if(!cmd) {
                this.client.commands.forEach((c) => {
                    if(c.aliases.length && c.aliases.includes(args[0].toLowerCase())) {
                        cmd = c;
                    }
                });
            }


            if(!cmd && !["music", "filters", "information", "info", "settings"].includes(args[0].toLowerCase())) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Such Command or Category "${args.join(" ")}"`)
                    ]
                });
            }

            else if(args[0].toLowerCase() === "music") {

            } else if(args[0].toLowerCase() === "filters") {
                
            } else if(args[0].toLowerCase() === "information" || args[0].toLowerCase() === "info") {
                
            } else if(args[0].toLowerCase() === "owner") {

            } else if(args[0].toLowerCase() === "settings" || args[0].toLowerCase() === "setting") {

            } else if(cmd) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setAuthor({
                            name: `About ${cmd.name.slice(0,1).toUpperCase() + cmd.name.slice(1).toLowerCase()}`,
                            iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
                        })
                        .addFields([
                            {
                                name: "Description",
                                value: cmd.description ?? "No Description",
                            },
                            {
                                name: "Usage",
                                value: cmd.usage ? cmd.usage :  "No Usage Provided",
                                inline: true
                            },
                            {
                                name: "Aliases",
                                value: `${cmd.aliases.length ? cmd.aliases.map(x => `\`${x.slice(0,1).toUpperCase()+x.slice(1).toLowerCase()}\``).join(", ") : "No Alaiases Provided"}`,
                                inline: true
                            }
                        ]).setFooter({
                            text: `Requested By: ${message.author.globalName ?? message.author.username}`,
                            iconURL: message.author.displayAvatarURL({
                                forceStatic: false
                            })
                        })
                    ]
                });
            }
        }
    }
}