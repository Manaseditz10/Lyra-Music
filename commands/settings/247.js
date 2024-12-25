const { EmbedBuilder } = require("@discordjs/builders");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class TwentyFourSeven extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "247",
            aliases: ['twentyfourseven', '24-7', '24/7'],
            cat: 'settings',
            args: false,
            desc: "Sets if the Player is to be there for forever",
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true
            },
            options: [
                {
                    name: 'enable',
                    description: "Enables 24/7 mode",
                    required: false,
                    type: 1,
                },
                {
                    name: 'disable',
                    description: 'disables 24/7 mode',
                    required: false,
                    type: 1
                }
            ]
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);
        
        if(!player) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color)
                    .setDescription(`${this.client.emoji.cross} There is no Player in this Guild.`)
                ]
            })
        }

        let data = await this.client.db.getAfkData(message.guild.id);

        if(!data || !data.enabled) {
            await this.client.db.enableAfK(message.guild,player);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setDescription(`${this.client.emoji.tick} Successfully **Enabled** the 24/7 Mode for this Guild.`)
                ]
            });
        } else {
            await this.client.db.disableAfk(message.guild);
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setDescription(`${this.client.emoji.cross} Successfully **Disabled** the 24/7 Mode for this Guild.`)
                ]
            });
        }
    }
}