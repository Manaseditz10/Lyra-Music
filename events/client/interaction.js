const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");
const BaseEvent = require("../../assets/baseEvent");
const { WebhookClient } = require("discord.js");

module.exports = class BaseInteraction extends BaseEvent {
    constructor(client) {
        super(client, {
            name: "ClientInteraction",
            eventName: "interactionCreate"
        });
    }
    async run(interaction) {
        if (interaction.isButton()) {
            let member = interaction.member;
            let bot = interaction.guild.members.me;

            if (interaction.customId === "owner_del") {
                if (this.client.config.owners.includes(interaction.user.id)) {
                    await interaction.deferUpdate();

                    return await interaction.message.delete().catch(() => { });
                } else {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} You are not Allowed to use this Button.`)
                        ],
                        ephemeral: true
                    });
                }
            } else if (interaction.customId === "stop-music") {

                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guild.id);

                if (!player) { await interaction.deferUpdate(); return interaction.message.delete().catch(() => { }) }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} No Track is Being played.`)
                        ],
                        ephemeral: true
                    });
                }

                await player.stop();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.stop} Successfully *Stopped* the Player.`)
                    ],
                    ephemeral: true
                });
            } else if (interaction.customId === "pause-music") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    await interaction.deferUpdate();

                    return await interaction.message.delete().catch((e) => { });
                }

                if (!player.isPlaying()) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    })
                }

                let state = player.isPaused();

                state ? await player.resume() : await player.pause();
                await player.data.get("nowPlayingMsg")?.edit({
                    components: [
                        new ActionRowBuilder().addComponents([
                            new ButtonBuilder().setLabel(state ? "Pause" : "Resume").setCustomId("pause-music").setStyle(3),
                            new ButtonBuilder().setLabel("Previous").setCustomId("prevíous-music").setStyle(2),
                            new ButtonBuilder().setLabel("Loop").setStyle(1).setCustomId("loop-music"),
                            new ButtonBuilder().setCustomId("skip-music").setLabel("Skip").setStyle(2),
                            new ButtonBuilder().setCustomId(`stop-music`).setLabel("Stop").setStyle(4)
                        ])
                    ]
                }).catch((e) => { });

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji[state ? "resume" : "pause"]} *${state ? "Resumed" : "Paused"}* the Player.`)
                    ],
                    ephemeral: true
                });
            }

            else if (interaction.customId === "skip-music") {

                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guild.id);

                if (!player) {
                    await interaction.deferUpdate();
                    return await interaction.message.delete().catch(() => { });
                }

                if (!player.isPlaying()) {
                    return await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                await player.skip();

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.skip} *Skipped* the Player.`)
                    ],
                    ephemeral: true
                });
            } else if (interaction.customId === "previous-music") {

                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guild.id);

                if (!player) {
                    await interaction.deferUpdate();
                    return await interaction.message.delete().catch(() => { });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.previous) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} There is no Previous Track in the Queue.`)
                        ],
                        ephemeral: true
                    });
                }

                await player.queue.unshift(player.previous);
                await player.skip();
                if (!player.isPlaying()) await player.play();
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.previous} Playing the previous track...`)
                    ],
                    ephemeral: true
                });
            } else if (interaction.customId === "loop-music") {

                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guild.id);

                if (!player) {
                    await interaction.deferUpdate();
                    return await interaction.message.delete().catch(() => { });
                }

                if (!player.isPlaying()) {
                    return await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                let loopMode = player.loopMode;
                if (loopMode === "off") {
                    player.loopMode = "track";
                } else if (loopMode === "track") {
                    player.loopMode = "queue";
                } else if (loopMode === "queue") {
                    player.loopMode = "off";
                }

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.loop} Changed the Loop Mode to: ${loopMode === "off" ? "Track" : loopMode === "track" ? "Queue" : "Off"}`)
                    ],
                    ephemeral: true
                });
            } else if (interaction.customId === "help-button") {
                let em1 = new EmbedBuilder().setColor(this.client.config.color).setDescription(`Lyra is a destined crystal quality audio parsing musical bot,\nfor all your freshing moods and entertainment.`).addFields([
                    {
                        name: 'Command Categories',
                        value: `${this.client.emoji.music} Music\n${this.client.emoji.filters} Filters\n${this.client.emoji.settings} Settings\n${this.client.emoji.info} Information\n${this.client.emoji.owner} Owner`
                    }
                ]).setAuthor({
                    name: `${this.client.user.username}'s Help menu`,
                    iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
                }).setFooter({
                    text: `Made with 💘 by Lyra Developers`,
                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                });

                let row1 = new ActionRowBuilder().addComponents([
                    new StringSelectMenuBuilder().setCustomId("help-menu").setPlaceholder("Select Categories").setDisabled(false).addOptions([
                        {
                            label: "Home",
                            emoji: this.client.emoji.home,
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
                            emoji: `${this.client.emoji.settings}`,
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
                            label: "All Commands",
                            emoji: this.client.emoji.allCommands,
                            value: 'allCmds-help'
                        }
                    ])
                ]);
                return interaction.update({
                    embeds: [em1],
                    components: [row1]
                });
            } else if (interaction.customId === "home-help-menu") {
                let embed = new EmbedBuilder().setColor(this.client.config.color).setDescription(`Lyra is a destined crystal quality audio parsing musical bot,\nfor all your freshing moods and entertainment.`).addFields([
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
                            emoji: `${this.client.emoji.settings}`,
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


                return await interaction.update({
                    embeds: [embed],
                    components: [row1, row2]
                });
            } else if (interaction.customId === "cmd-list-help" || interaction.customId === "btn-menu-help") {
                let musicCommands = [];
                let filterCommands = [];
                let infoCommands = [];
                let settingCommands = [];
                let ownerCommands = [];

                this.client.commands.forEach((cmd) => {
                    switch (cmd.category) {
                        case "music":
                            musicCommands.push(cmd);
                            break;
                        case "filters":
                            filterCommands.push(cmd);
                            break;
                        case "info":
                            infoCommands.push(cmd);
                            break;
                        case "settings":
                            settingCommands.push(cmd);
                            break;
                        case "owner":
                            ownerCommands.push(cmd);
                            break;
                        default:
                            break;
                    }
                });


                let embed = new EmbedBuilder().setColor(this.client.config.color)
                    .setAuthor({
                        name: `${this.client.user.username}'s Help Menu`,
                        iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
                    }).setDescription(`Lyra is a destined crystal quality audio parsing musical bot,\nfor all your freshing moods and entertainment.`)
                    .addFields([
                        {
                            name: `Music **[${musicCommands.length}]**`,
                            value: `${musicCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                        },
                        {
                            name: `Filters **[${filterCommands.length}]**`,
                            value: `${filterCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                        },
                        {
                            name: `Information **[${infoCommands.length}]**`,
                            value: `${infoCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                        },
                        {
                            name: `Settings **[${settingCommands.length}]**`,
                            value: `${settingCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                        },
                        {
                            name: `Owner **[${ownerCommands.length}]**`,
                            value: `${ownerCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                        }
                    ]).setThumbnail(interaction.guild.iconURL({ forceStatic: false })).setFooter({
                        text: `Made with 💘 by Lyra Developers`,
                        iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                    });

                return await interaction.update({
                    embeds: [embed]
                })
            } else if (interaction.customId === "setup-previous") {

                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guild.id);
                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.previous) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} There is no Previous Track in the Queue.`)
                        ],
                        ephemeral: true
                    });
                }

                await player.queue.unshift(player.previous);
                await player.skip();
                if (!player.isPlaying()) await player.play();
                await interaction.deferUpdate();

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.previous} Playing Previous Track...\n${this.client.emoji.requester} Action Made by: [${member.user.globalName ? member.user.globalName : member.user.username}](https://discord.com/users/${member.user.id})`)
                    ]
                }).then(msg => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-stop") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                if (player.queue.length) {
                    await player.stop();
                } else {
                    await player.skip();
                }


                await interaction.deferUpdate();

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Stopped the Player\n${this.client.emoji.requester} \`:\` ${member.user.globalName}`)
                    ],
                    ephemeral: true
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-pause") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }
                await interaction.deferUpdate();

                let state = player.isPaused();

                let btn1 = new ButtonBuilder().setEmoji(this.client.emoji.setup.previous).setStyle(2).setCustomId("setup-previous");
                let btn2 = new ButtonBuilder().setEmoji(this.client.emoji.setup.stop).setStyle(2).setCustomId("setup-stop");
                let btn3 = new ButtonBuilder().setEmoji(state ? this.client.emoji.setup.pause : this.this.client.emoji.setup.pause).setStyle(2).setCustomId("setup-pause");
                let btn4 = new ButtonBuilder().setEmoji(this.client.emoji.setup.loop).setStyle(2).setCustomId("setup-loop");
                let btn5 = new ButtonBuilder().setEmoji(this.client.emoji.setup.skip).setStyle(2).setCustomId("setup-skip");

                let btn6 = new ButtonBuilder().setEmoji(this.client.emoji.setup.volLow).setStyle(2).setCustomId("setup-volLow");
                let btn7 = new ButtonBuilder().setEmoji(this.client.emoji.setup.clearQueue).setStyle(2).setCustomId("setup-clearQueue");
                let btn8 = new ButtonBuilder().setEmoji(this.client.emoji.setup.shuffle).setStyle(2).setCustomId("setup-shuffle");
                let btn9 = new ButtonBuilder().setEmoji(this.client.emoji.setup.autoplay).setStyle(2).setCustomId("setup-autoplay");
                let btn10 = new ButtonBuilder().setEmoji(this.client.emoji.setup.volHigh).setStyle(2).setCustomId("setup-volHigh");

                let row1 = new ActionRowBuilder().addComponents([btn1, btn2, btn3, btn4, btn5]);
                let row2 = new ActionRowBuilder().addComponents([btn6, btn7, btn8, btn9, btn10]);

                await interaction.message.edit({
                    components: [row1, row2]
                });

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} **${state ? "Resumed" : "Paused"} the Player.\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-loop") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                let loopMode = player.loopMode;
                if (loopMode === "off") {
                    player.loopMode = "track";
                } else if (loopMode === "track") {
                    player.loopMode = "queue";
                } else if (loopMode == "queue") {
                    player.loopMode = "off";
                }


                await interaction.deferUpdate();

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.loop} Player's Loop mode is set to: \`${loopMode === "off" ? "track" : loopMode === "track" ? "queue" : "off"}\`\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-skip") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                await interaction.deferUpdate();
                await player.skip();

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.skip} Skipped the Current Track.\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-volLow") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                let vol = player.getVolume();

                if (vol <= 0) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Volume Cannot be Lowered anymore.`)
                        ],
                        ephemeral: true
                    })
                }


                await player.setVol(vol - 10);

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.setup.volLow} Lowered the Volume\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-shuffle") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.queue.length) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Player Queue is Empty.`)
                        ],
                        ephemeral: true
                    });
                }

                await interaction.deferUpdate();

                player.queue = player.queue.sort(() => Math.random() - 0.5);


                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.shuffle} Shuffled the Queue.\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-clearQueue") {
                if (!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if (bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if (!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true
                    });
                }

                if (!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true
                    });
                }

                if(!player.queue.length) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There are no Further Tracks in the Queue.`)
                        ],
                        ephemeral: true 
                    });
                }

                await interaction.deferUpdate();

                player.queue.length = 0;

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Cleared the Queue.\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if (interaction.customId === "setup-volHigh") {
                if(!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if(bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if(!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true 
                    });
                }

                if(!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true 
                    });
                }

                let vol = player.getVolume();

                if (vol >= 200) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Volume Cannot be Increased anymore.`)
                        ],
                        ephemeral: true
                    })
                }


                await player.setVol(vol + 10);

                return await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.setup.volHigh} Increased the Volume\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
            } else if(interaction.customId === "setup-autoplay") {
                if(!member.voice.channel && bot.voice.channel) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                        ],
                        ephemeral: true
                    });
                }

                if(bot.voice.channel && member.voice.channel.id !== bot.voice.channel.id) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${message.guild.members.me.voice.channel}`)
                        ],
                        ephemeral: true
                    })
                }

                let player = this.client.music.playersMap.get(interaction.guildId);

                if(!player) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in the Guild Currently.`)
                        ],
                        ephemeral: true 
                    });
                }

                if(!player.isPlaying()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played.`)
                        ],
                        ephemeral: true 
                    });
                }

                let data = await this.client.db.getAutoPlayData({ id: interaction.guild.id });

                if(!data || (data && !data.enabled)) {
                    await interaction.deferUpdate();

                    await this.client.db.enableAutoplay(interaction.guild.id);

                    return await interaction.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Enabled the Autoplay for the Guild.\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                        ]
                    }).then((msg) => {
                        setTimeout(async () => {
                            await msg.delete().catch((e) => { });
                        }, 5000);
                    });
                } else {
                    await interaction.deferUpdate();

                    await this.client.db.disableAutoplay(interaction.guild.id);

                    return await interaction.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Disabled the Autoplay for the Guild.\n${this.client.emoji.requester} \`:\` ${member.user.globalName ? member.user.globalName : member.user.username}`)
                        ]
                    }).then((msg) => {
                        setTimeout(async () => {
                            await msg.delete().catch((e) => { });
                        }, 5000);
                    });
                }
            }

        } else if (interaction.isChatInputCommand()) {
            let command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            else {
                if (command.ownerOnly) {
                    if (!this.client.config.owners.includes(interaction.user.id)) {
                        return await interaction.reply({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} You are not allowed to Execute this Command.`)
                            ]
                        })
                    }
                }

                if (command.voiceSettings !== undefined) {
                    if (command.voiceSettings.vc && !interaction.member.voice?.channel) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please Connect to a Voice Channel.`)
                            ]
                        });
                    }

                    if (command.voiceSettings.sameVc && interaction.guild.members.me.voice.channel && interaction.member.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please make sure you are Connected to: ${interaction.guild.members.me.voice.channel}`)
                            ]
                        });
                    }

                    if (command.voiceSettings.player) {
                        let player = this.client.music.playersMap.has(interaction.guild.id);
                        if (!player) {
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                                ]
                            })
                        }
                    }
                }

                command.exec(interaction).catch((e) => {
                    this.client.logger.error(`Caught Error in Command Execution:`, e);
                }).then(() => {
                    let web = new WebhookClient({ url: this.client.config.webhooks.cmds });

                    web.send({
                        content: `\`\`\`js\nSlash Command Execution Logs\n\nCommand Name: ${command.name}\nCommand Author: ${interaction.user.globalName ?? interaction.user.username}\nGuild name: ${interaction.guild.name}\n Command Channel Name: ${interaction.channel.name}\`\`\``
                    }).catch((e) => { });
                });
            }
        } else if (interaction.isSelectMenu()) {
            for (let value of interaction.values) {
                if (value === "music-help") {
                    let musicCommands = [];
                    this.client.commands.forEach((cmd) => {
                        if (cmd.category === "music") musicCommands.push(cmd);
                    });
                    return await interaction.update({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setTitle(`Music Commands [${musicCommands.length}]`)
                                .setDescription(`${musicCommands.map(x => `\`${x.name.slice(0, 1).toUpperCase() + x.name.slice(1).toLowerCase()}\``)}`).setFooter({
                                    text: `Requested By: ${interaction.user.globalName ?? interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                                })
                        ]
                    });
                } else if (value === "filters-help") {
                    let musicCommands = [];
                    this.client.commands.forEach((cmd) => {
                        if (cmd.category === "filters") musicCommands.push(cmd);
                    });
                    return await interaction.update({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setTitle(`Filters Commands [${musicCommands.length}]`)
                                .setDescription(`${musicCommands.map(x => `\`${x.name.slice(0, 1).toUpperCase() + x.name.slice(1).toLowerCase()}\``)}`).setFooter({
                                    text: `Requested By: ${interaction.user.globalName ?? interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                                })
                        ]
                    });
                } else if (value === "settings-help") {
                    let musicCommands = [];
                    this.client.commands.forEach((cmd) => {
                        if (cmd.category === "settings") musicCommands.push(cmd);
                    });
                    return await interaction.update({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setTitle(`Settings Commands [${musicCommands.length}]`)
                                .setDescription(`${musicCommands.map(x => `\`${x.name.slice(0, 1).toUpperCase() + x.name.slice(1).toLowerCase()}\``)}`).setFooter({
                                    text: `Requested By: ${interaction.user.globalName ?? interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                                })
                        ]
                    });
                } else if (value === "info-help") {
                    let musicCommands = [];
                    this.client.commands.forEach((cmd) => {
                        if (cmd.category === "info") musicCommands.push(cmd);
                    });
                    return await interaction.update({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setTitle(`Information Commands [${musicCommands.length}]`)
                                .setDescription(`${musicCommands.map(x => `\`${x.name.slice(0, 1).toUpperCase() + x.name.slice(1).toLowerCase()}\``)}`).setFooter({
                                    text: `Requested By: ${interaction.user.globalName ?? interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                                })
                        ]
                    });
                } else if (value === "owner-help") {
                    let musicCommands = [];
                    this.client.commands.forEach((cmd) => {
                        if (cmd.category === "owner") musicCommands.push(cmd);
                    });
                    return await interaction.update({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                                .setTitle(`Owner Commands [${musicCommands.length}]`)
                                .setDescription(`${musicCommands.map(x => `\`${x.name.slice(0, 1).toUpperCase() + x.name.slice(1).toLowerCase()}\``)}`).setFooter({
                                    text: `Requested By: ${interaction.user.globalName ?? interaction.user.username}`,
                                    iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                                })
                        ]
                    });
                } else if (value === "allCmds-help") {
                    let musicCommands = [];
                    let filterCommands = [];
                    let infoCommands = [];
                    let settingCommands = [];
                    let ownerCommands = [];

                    this.client.commands.forEach((cmd) => {
                        switch (cmd.category) {
                            case "music":
                                musicCommands.push(cmd);
                                break;
                            case "filters":
                                filterCommands.push(cmd);
                                break;
                            case "info":
                                infoCommands.push(cmd);
                                break;
                            case "settings":
                                settingCommands.push(cmd);
                                break;
                            case "owner":
                                ownerCommands.push(cmd);
                                break;
                            default:
                                break;
                        }
                    });


                    let embed = new EmbedBuilder().setColor(this.client.config.color)
                        .setAuthor({
                            name: `${this.client.user.username}'s Help Menu`,
                            iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
                        }).setDescription(`Lyra is a destined crystal quality audio parsing musical bot,\nfor all your freshing moods and entertainment.`)
                        .addFields([
                            {
                                name: `Music **[${musicCommands.length}]**`,
                                value: `${musicCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                            },
                            {
                                name: `Filters **[${filterCommands.length}]**`,
                                value: `${filterCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                            },
                            {
                                name: `Information **[${infoCommands.length}]**`,
                                value: `${infoCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                            },
                            {
                                name: `Settings **[${settingCommands.length}]**`,
                                value: `${settingCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                            },
                            {
                                name: `Owner **[${ownerCommands.length}]**`,
                                value: `${ownerCommands.map(cmd => `\`${cmd.name.slice(0, 1).toUpperCase() + cmd.name.slice(1).toLowerCase()}\``).join(", ")}`
                            }
                        ]).setThumbnail(interaction.guild.iconURL({ forceStatic: false })).setFooter({
                            text: `Made with 💘 by Lyra Developers`,
                            iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                        });

                    return await interaction.update({
                        embeds: [embed]
                    });
                } else if (value === "home-help") {
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
                        iconURL: interaction.user.displayAvatarURL({ forceStatic: false })
                    });


                    return await interaction.update({
                        embeds: [em1]
                    });
                }
            }
        }
    }
}