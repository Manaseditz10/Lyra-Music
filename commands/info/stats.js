const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { cpus, totalmem } = require("node:os");
const { cpu } = require('systeminformation');

module.exports = class Stats extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "stats",
            aliases: ['st'],
            cat: "info",
            args: false,
            desc: "Shows the statistics of the bot",
            options: [],
            ownerOnly: false,
        })
    }
    async run(message, args, prefix) {
        let embed1 = new EmbedBuilder().setColor(this.client.config.color).setAuthor({
            name: `${this.client.user.username}`,
            iconURL: this.client.user.displayAvatarURL()
        }).addFields([
            {
                name: `${this.client.user.username}'s Information`,
                value: `Bot's Mention: ${this.client.user}\nBot's Version: ${require("../../package.json").version}\nTotal Servers: ${await this.client.shard.broadcastEval(x => x.guilds.cache.size).then(r => r.reduce((a, b) => a + b, 0))}\nTotal Users: ${await this.client.shard.broadcastEval(x => x.guilds.cache.filter(x => x.available).reduce((a, b) => a + b.memberCount, 0)).then((r) => r.reduce((acc, memberCount) => acc + memberCount, 0))}\nTotal Channels: ${this.client.channels.cache.size}\nLast Rebooted: <t:${Math.round(this.client.readyTimestamp / 1000)}:R>`
            }
        ]).setFooter({
            text: `Requested By: ${message.author.globalName ?? message.author.username}`,
            iconURL: message.author.displayAvatarURL({ forceStatic: false })
        }).setThumbnail(this.client.user.displayAvatarURL({ forceStatic: false }));

        let cpuUsage;
        let cpuFree;
        const lol =
            Object.values(cpus()[0].times).reduce((a, b) => a + b, 0) *
            100;
        const lol2 = (process.cpuUsage().user + process.cpuUsage().system) * 1000;
        cpuUsage = (lol2 / lol).toFixed(2);
        cpuFree = (100 - cpuUsage).toFixed(2);


        let btn2 = new ButtonBuilder().setLabel("General Info").setCustomId("general-info").setStyle(2);
        let btn1 = new ButtonBuilder().setLabel("Team Info").setCustomId("team-info").setStyle(2);
        let btn3 = new ButtonBuilder().setLabel("System Info").setCustomId("sys-info").setStyle(2);


        let embed3 = new EmbedBuilder().setColor(this.client.config.color).setFooter({
            text: `Requested By: ${message.author.globalName ?? message.author.username}`,
            iconURL: message.author.displayAvatarURL({ forceStatic: false })
        }).setAuthor({
            name: this.client.user.username,
            iconURL: this.client.user.displayAvatarURL()
        })
        .addFields([
            {
                name: 'CPU Info',
                value: `Cores: ${(await cpu()).cores}\nModel: ${cpus()[0].model}\nSpeed: ${cpus()[0].speed}\nUsage: ${cpuUsage}\nFree: ${cpuFree}`
            },
            {
                name: "Memory Info",
                value: `Total: ${(totalmem()/1024/1024).toFixed(2)}\nUsed: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)}\nFree: ${(totalmem() / 1024/1024 - process.memoryUsage().heapUsed / 1024/ 1024).toFixed(2)}`
            }
        ]).setThumbnail(this.client.user.displayAvatarURL());
        

        let row1 = new ActionRowBuilder().addComponents([btn1, btn2.setDisabled(true), btn3]);

        let msg = await message.channel.send({
            embeds: [embed1],
            components: [row1]
        });


        let collector = msg.createMessageComponentCollector({
            filter(b) {
                if(b.user.id === message.author.id) return true;
                else return b.reply({
                    content: `You are not allowed to use this Interaction`,
                    ephemeral: true
                });
            },
            time: 100000 * 7,
            idle: 100000 * 7/2
        });

        collector.on("collect", async interaction => {
            if(interaction.isButton()) {
                if(interaction.customId === "sys-info") {
                    return await interaction.update({
                        embeds: [embed3],
                        components: [
                            new ActionRowBuilder().addComponents([btn1,btn2,btn3.setDisabled(true)])
                        ]
                    });
                } else if(interaction.customId === "general-info") {
                    return await interaction.update({
                        embeds: [embed1],
                        components: [
                            new ActionRowBuilder().addComponents([
                                btn1.setDisabled(true), btn2, btn3
                            ])
                        ]
                    })
                }
            }
        });
        collector.on("end", async it => {
            if(!msg) return;
            else {
                if(message.guild.messages.cache.get(msg.id)) {
                    return await msg.edit({
                        components: [
                            new ActionRowBuilder().addComponents([btn1.setDisabled(true), btn2.setDisabled(true), btn3.setDisabled(true)])
                        ]
                    });
                }
            }
        })
    }
}