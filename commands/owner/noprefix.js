const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { chunk } = require("../../assets/functions");

module.exports = class Noprefix extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "noprefix",
            aliases: ["nop"],
            cat: "owner",
            desc: "configures noprefix for the user",
            args: true,
            options: [{
                name: "add",
                type: 1,
                description: "adds noprefix to the user",
                options: [
                    {
                        name: "user",
                        type: 6,
                        required: true,
                        description: "gets the user"
                    }
                ]
            }],
            ownerOnly: true,
            usage: "<add/remove/list>",
            // voiceSettings: {}
        })
    }
    async run(message, args, prefix) {
        let opt = args[0]?.toLowerCase();

        if(!opt) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Valid Args Expected.\nOptions: \`add\`, \`remove\`, \`list\``)
                ]
            });
        }

        if(opt === "add") {
            let user = message.mentions.users.first() || this.client.users.cache.get(args[1]) || await this.client.users.fetch(args[1]).catch(() => {});

            if(!user) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Expected a Valid User.`)
                    ]
                });
            }

            let npData = await this.client.db.getNoPrefixList();

            if(npData && npData.array.includes(user.id)) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} User is Already in the Noprefix.`)
                    ]
                })
            }

            await this.client.db.addNoPrefix(user.id);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully **Added** ${user} to NoPrefix.`)
                ]
            })
        } else if(opt === "remove") {
            let user = message.mentions.users.first() || this.client.users.cache.get(args[1]) || await this.client.users.fetch(args[1]).catch(() => {});

            if(!user) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color)
                        .setDescription(`${this.client.emoji.cross} Expected a Valid User.`)
                    ]
                });
            }

            let npData = await this.client.db.getNoPrefixList();

            if(npData && !npData.array.includes(user.id)) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} User is Not in the Noprefix.`)
                    ]
                })
            }

            await this.client.db.removeNoPrefix(user.id);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully **Removed** ${user} to NoPrefix.`)
                ]
            });
        } else if(opt === "list") {

            let npData = await this.client.db.getNoPrefixList();

            if(!npData || !npData.array.length) {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There are no Users in the List.`)
                    ]
                })
            } 

            let msg = await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.warn} Fetching Users....`)
                ]
            });

            let data = npData.array;

            let users = [];
            let user;


            for(let i = 0; i < data.length; i++) {
                try {   
                    user = this.client.users.cache.get(data[i]) || await this.client.users.fetch(data[i]);
                    if(user) users.push(`**(${users.length+1}).** [${user.globalName ?? user.username}](${this.client.config.serverLink}) [ID: ${user.id}]`);
                } catch(e) {
                    continue;
                }
            }


            let chunks = chunk(data,10);
            let page = 0;
            let pages = chunks.map((x) => x.join("\n"));

            let embed = new EmbedBuilder().setColor(this.client.config.color).setDescription(`${pages[page]}`).setTitle(`Noprefix List`).setFooter({
                text: `Requested By: ${message.author.globalName ?? message.author.username}`,iconURL: message.author.displayAvatarURL({ forceStatic: false })
            });

            if(data.length < 11) {
                return await msg.edit({ embeds: [embed] });
            }

            let btn1 = new ButtonBuilder().setLabel("Previous").setStyle(2).setCustomId("previous-btn");
            let btn2 = new ButtonBuilder().setLabel("Stop").setStyle(4).setCustomId("stop-btn");
            let btn3 = new ButtonBuilder().setLabel("Next").setCustomId("next-btn").setStyle(2);

            let row = new ActionRowBuilder().addComponents([btn1, btn2, btn3]);

            msg = await msg.edit({
                embeds: [embed],
                components: [row]
            });


            let collector = msg.createMessageComponentCollector({
                filter(b) {
                    if(b.user.id === message.author.id) return true;
                    else {
                        return b.reply({
                            content: `You are not allowed to use this Interaction`,
                            ephemeral: true 
                        });
                    }
                },
                time: 1000000 * 7,
                idle: 1000000 * 7/2,
            });

            collector.on("collect", async interaction => {
                if(interaction.isButton()) {
                    if(interaction.customId === "previous-btn") {
                        page = page > 0 ? --page : pages.length - 1;
                        return await interaction.update({
                            embeds: [
                                embed.setDescription(`${pages[page]}`)
                            ]
                        });
                    } else if(interaction.customId === "next-btn") {
                        page = page + 1 < pages.length ? ++page : 0;

                        return await interaction.update({
                            embeds: [
                                embed.setDescription(`${pages[page]}`)
                            ]
                        });
                    } else if(interaction.customId === "stop-btn") {
                        await interaction.deferUpdate();
                        return await collector.stop();
                    }
                }
            });

            collector.on("end", async interaction => {
                if(message.channel.messages.cache.get(msg.id)) {
                    return await msg.edit({
                        components: [
                            new ActionRowBuilder().addComponents([
                                btn1.setDisabled(true),
                                btn2.setDisabled(true),
                                btn3.setDisabled(true)
                            ])
                        ]
                    });
                } else return;
            });
        }
    }
}