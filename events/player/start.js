const { EmbedBuilder } = require("discord.js");
const BaseEvent = require("../../assets/baseEvent");
const { humanizeTime, deleteSetup, updateSetupQueue } = require("../../assets/functions");
const { ActionRowBuilder } = require("discord.js");
const { ButtonBuilder } = require("discord.js");

module.exports = class PlayerStart extends BaseEvent {
    constructor(player) {
        super(player, {
            name: "playerStart",
            eventName: "start"
        });
        this.basePlayer = player;
        this.client = player.player.node.manager.connector.client
    }
    async run() {
        this.client.logger.player(`Player has been started playing music in the Guild: ${this.basePlayer.textChannel.id}`);

        let data = this.basePlayer.setupData;
        console.log(data);
        let channel;
        let msg;

        channel = this.basePlayer.guild.channels.cache.get(data?.channelId);
        if(!channel) {
            channel = await this.basePlayer.guild.channels.fetch(data?.channelId).catch(() => { });
        }

        if (channel?.id !== this.basePlayer.textChannel.id) {
            let msg2 = await this.basePlayer.textChannel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                        .setTitle(`${this.basePlayer.current.info.title.substring(0, 45)}`).setURL(this.client.config.serverLink)
                        .addFields([
                            {
                                name: `${this.client.emoji.requester} Requester`,
                                value: `${this.basePlayer.current.requester.globalName ? this.basePlayer.current.requester.globalName : this.basePlayer.current.requester.username}`,
                                inline: true
                            },
                            {
                                name: `${this.client.emoji.duration} Duration`,
                                value: `${humanizeTime(this.basePlayer.current.info.length)}`,
                                inline: true
                            }
                        ]).setThumbnail(this.basePlayer.current.info.artworkUrl)
                ],
                components: [
                    new ActionRowBuilder().addComponents([
                        new ButtonBuilder().setLabel("Pause").setCustomId("pause-music").setStyle(3),
                        new ButtonBuilder().setLabel("Previous").setCustomId("previous-music").setStyle(2),
                        new ButtonBuilder().setLabel("Loop").setStyle(1).setCustomId("loop-music"),
                        new ButtonBuilder().setCustomId("skip-music").setLabel("Skip").setStyle(2),
                        new ButtonBuilder().setCustomId(`stop-music`).setLabel("Stop").setStyle(4)
                    ])
                ]
            });

            this.basePlayer.data.set("nowPlayingMsg", msg2);
            if (this.basePlayer.previous) this.basePlayer.data.set("autoPlayId", this.basePlayer.previous.info.identifier);
        }

        console.log("Working");
        console.log(channel);
        if (!channel && data && data.channelId) {
            await deleteSetup(this.client, this.basePlayer.guild);

            return;
        }

        msg = channel?.messages?.cache?.get(data?.messageId) ;
        if(!msg) {
            msg = await channel?.messages?.fetch(data?.messageId).catch(() => { });
        }

        if (!msg) return;
        updateSetupQueue(this.client, this.basePlayer, this.basePlayer.guild);

        let embed = new EmbedBuilder().setColor(this.client.config.color).setAuthor({
            name: `${this.client.user.username} Player`,
            iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
        }).setURL(this.client.config.serverLink).setImage(this.client.config.setupImg).setTitle(`${this.basePlayer.current.info.title.substring(0, 45)}`).setFooter({
            text: `Thanks for Choosing ${this.client.user.username}`,
            iconURL: this.basePlayer.guild.iconURL({ forceStatic: false })
        });
        let btn1 = new ButtonBuilder().setEmoji(this.client.emoji.setup.previous).setStyle(2).setCustomId("setup-previous");
        let btn2 = new ButtonBuilder().setEmoji(this.client.emoji.setup.stop).setStyle(2).setCustomId("setup-stop");
        let btn3 = new ButtonBuilder().setEmoji(this.client.emoji.setup.pause).setStyle(2).setCustomId("setup-pause");
        let btn4 = new ButtonBuilder().setEmoji(this.client.emoji.setup.loop).setStyle(2).setCustomId("setup-loop");
        let btn5 = new ButtonBuilder().setEmoji(this.client.emoji.setup.skip).setStyle(2).setCustomId("setup-skip");

        let btn6 = new ButtonBuilder().setEmoji(this.client.emoji.setup.volLow).setStyle(2).setCustomId("setup-volLow");
        let btn7 = new ButtonBuilder().setEmoji(this.client.emoji.setup.clearQueue).setStyle(2).setCustomId("setup-clearQueue");
        let btn8 = new ButtonBuilder().setEmoji(this.client.emoji.setup.shuffle).setStyle(2).setCustomId("setup-shuffle");
        let btn9 = new ButtonBuilder().setEmoji(this.client.emoji.setup.autoplay).setStyle(2).setCustomId("setup-autoplay");
        let btn10 = new ButtonBuilder().setEmoji(this.client.emoji.setup.volHigh).setStyle(2).setCustomId("setup-volHigh");

        let row1 = new ActionRowBuilder().addComponents([btn1, btn2, btn3, btn4, btn5]);
        let row2 = new ActionRowBuilder().addComponents([btn6, btn7, btn8, btn9, btn10]);

        await msg?.edit({
            embeds: [
                embed
            ], components: [row1, row2]
        }).catch((e) => { });
    }
}