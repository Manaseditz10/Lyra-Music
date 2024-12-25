const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { humanizeTime, chunk } = require("../../assets/functions")

module.exports = class Queue extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ["q"],
            cat: "music",
            desc: "displays the queue of the guild",
            args: false,
            options: [],
            ownerOnly: false,
            args: false,
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true,
            }
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            });
        } 

        let queue = player.queue;

        if(!queue.length && !player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} The Queue is Empty.`)
                ]
            });
        }

        if(player.isPlaying() && queue.length === 0) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .addFields([
                        {
                            name: 'Now Playing',
                            value: `**[${player.current.info.title.substring(0, 45)}](${this.client.config.serverLink})** • left: ${humanizeTime(Math.floor(player.current.info.length - player.position))}`
                        }
                    ])
                ]
            });
        }


        let songs = [];
        songs.push(`**Now Playing**\n\n**[${player.current.info.title.substring(0, 45)}](${this.client.config.serverLink})** • left: ${humanizeTime(Math.floor(player.current.info.length - player.position))}`);
        for(let i = 0; i < queue.length; i++) {
            songs.push(
                `**${i+1}).** *[${queue[i].info.title.substring(0,40) + "..."}](${this.client.config.serverLink})* • (${humanizeTime(queue[i].info.length)})`
            );
        }

        if(songs.length < 11) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setTitle(`${message.guild.name}'s Queue`).setDescription(songs.join("\n"))
                ]
            });
        } else {
            let maps = chunk(songs, 10);

            let pages = maps.map(x => x.join("\n"));

            let page = 0; 

            const embed = new EmbedBuilder().setColor(this.client.config.color).setTitle(`${message.guild.name}'s Queue`).setFooter({
                text: `Requested By: ${message.author.globalName ? message.author.globalName : message.author.username}`,
                iconURL: message.author.displayAvatarURL({ forceStatic: false })
            });

            let btn1 = new ButtonBuilder().setCustomId("previous").setLabel("Previous").setStyle(2);
            let btn2 = new ButtonBuilder().setCustomId("stop").setLabel("Stop").setStyle(4);
            let btn3 = new ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(2);

            let row = new ActionRowBuilder().addComponents([ btn1, btn2, btn3 ]);

            let msg = await message.channel.send({
                embeds: [
                    embed.setDescription(`${pages[page]}`)
                ],
                components: [ row ]
            });

            let collector = msg.createMessageComponentCollector({
                filter: (b) => {
                    if(b.user.id === message.author.id) return true;
                    else {
                        return b.reply({
                            embeds: [
                                new EmbedBuilder().setColor(this.client.config.color)
                                .setDescription(`${this.client.emoji.cross} You are not allowed to use this Interaction.`)
                            ],
                            ephemeral: true
                        });
                    }
                },
                time: 100000 * 7,
                idle: 100000 * 7 /2
            });

            collector.on("collect", async interaction => {
                if(interaction.isButton()) {
                    if(interaction.customId === "next") {
                        page = page + 1 < pages.length ? ++page : 0;

                        return await interaction.update({
                            embeds: [
                                embed.setDescription(`${pages[page]}`)
                            ]
                        });
                    } else if(interaction.customId === "stop") {
                        await interaction.deferUpdate();

                        return await collector.stop();
                    } else if(interaction.customId === "previous") {
                        page = page > 0 ? --page : pages.length - 1;
                        return await interaction.update({
                            embeds: [
                                embed.setDescription(`${pages[page]}`)
                            ]
                        });
                    }
                }
            });

            collector.on("end", async int => {
                if(int.channel.messages.cache.get(msg.id)) {
                    await msg.edit({
                        components: [
                            new ActionRowBuilder().addComponents([
                                btn1.setDisabled(true),
                                btn2.setDisabled(true),
                                btn3.setDisabled(true)
                            ])
                        ]
                    });
                }
            });
        }
    }
}