const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Loop extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "loop",
            aliases: [],
            cat: "music",
            ownerOnly: false,
            args: false,
            usage: "[off/track/queue]",
            desc: "sets the loop mode of the player",
            options: [
                {
                    name: "off",
                    description: "turns off the loop mode",
                    type: 1
                },
                {
                    name: "track",
                    description: "sets the loop mode to track",
                    type: 1
                },
                {
                    name: "queue",
                    description: "sets the loop mode to queue",
                    type: 1,
                }
            ],
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true
            }
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            })
        }
        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} No Track is Queued.`)
                ]
            });
        }

        if(!args.length) {
            let loopMode = player.loopMode;
            if(loopMode === "off") {
                player.loopMode = "track";
            } else if(loopMode === "track") {
                player.loopMode = "queue";
            } else if(loopMode === "queue") {
                player.loopMode = 'off';
            }

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji["loop"]} The Loop mode now Applied: ${loopMode === "off" ? "Track" : loopMode === "track" ? "Queue" : "Off"}`)
                ]
            });
        } else {
            let opt = args[0].toLowerCase();

            switch(opt) {
                case "off":
                    player.loopMode = "off";
                    await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji["loop"]} The Loop mode now Applied: ${loopMode === "off" ? "Track" : loopMode === "track" ? "Queue" : "Off"}`)
                        ]
                    });
                    break;
                case "track" || "one" || "song":
                    player.loopMode = "track";
                    await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji["loop"]} The Loop mode now Applied: Track`)
                        ]
                    });
                    break;
                case "queue" || "all" :
                    player.loopMode = "queue";
                    await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji["loop"]} The Loop mode now Applied: Queue`)
                        ]
                    });
                    break;
                default:
                    await message.channel.send({
                        embeds: [
                            new EmbedBuilder().setColor(this.client.config.color)
                            .setDescription(`${this.client.emoji.cross} Unexpected Arguement.\nAvailable options: \`off\`, \`track\`, \`queue\``)
                        ]
                    });
                    return;
            }
        }
    }
}