const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Leave extends BaseCommand {
    constructor(client) {
        super(client,{
            name: "leave",
            aliases: ['disconnect'],
            cat: "music",
            args: true,
            desc: "Disconnects the player from the voice channel",
            ownerOnly: false,
            voiceSettings: {
                vc: true,
                sameVc: true,
            }
        });
    }
    async run(message,args,prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            });
        } else {
            let dest = await this.client.music.destroySession(message.guild.id);

            if(dest) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully Destroyed the Player.`)
                    ]
                });
            } else {
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There was some Error while disconnecting the Player.... Please try after a while.`)
                    ]
                });
            }
        }
    }
}