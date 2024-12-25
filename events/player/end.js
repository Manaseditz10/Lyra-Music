const BaseEvent = require("../../assets/baseEvent");
const { deleteSetup, updateSetupQueue } = require("../../assets/functions");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = class TrackEnd extends BaseEvent {
    constructor(player) {
        super(player, {
            name: "TrackEnd",
            eventName: "end"
        });
        this.player = player;
        this.client = player.player.node.manager.connector.client;
    }
    async run() {
        this.player.data.get("nowPlayingMsg")?.delete().catch(() => { });
        this.player.data.delete("nowPlayingMsg");

        let setupData = this.player.setupData;
        let channel = setupData?.channelId;

        channel = this.player.guild.channels.cache.get(channel) || (await this.player.guild.channels.fetch(channel).catch((e) => { return undefined; }));

        if (!channel) {
            await deleteSetup(this.client, this.player.guild);
        }

        if (channel) {
            updateSetupQueue(this.client, this.player, this.player.guild);
            if (!this.player.queue.length) {
                let embed = new EmbedBuilder().setColor(this.client.config.color).setTitle(`Nothing Playing right now`).setURL(this.client.config.serverLink).setImage(this.client.config.setupImg).setAuthor({
                    name: `${this.client.user.username}`,
                    iconURL: this.client.user.displayAvatarURL({ forceStatic: false })
                }).setFooter({
                    text: `Thanks for Choosing ${this.client.user.username}`,
                    iconURL: this.player.guild.iconURL({ forceStatic: false })
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

                
                let msg = setupData?.messageId;
                msg = channel.messages.cache.get(msg);
                if(!msg) {
                    msg = await channel.messages.fetch(setupData?.messageId).catch(() => { });
                }

                if(msg) {
                    await msg.edit({
                        embeds: [embed],
                        components: [row1,row2]
                    }).catch(() => { });
                }
            }
        }

        let loopMode = this.player.loopMode;
        if (loopMode === "track") {
            this.player.queue.unshift(this.player.current);
        }
        if (loopMode === "queue") {
            this.player.queue.push(this.current);
        }
        this.player.previous = this.player.current;
        this.player.current = null;

        let autoPlaySettings = await this.client.db.getAutoPlayData({ id: this.player.guild.id });
        if (autoPlaySettings?.enabled && !this.player.queue.length) {
            await this.player.autoPlay();
            return;
        } else {
            await this.player.play();
            return;
        }
    }
}