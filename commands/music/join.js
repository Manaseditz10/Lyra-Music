const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Join extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "join",
            aliases: ["connect"],
            cat: "music",
            usage: "",
            args: false,
            ownerOnly: false,
            desc: "Connects to a Voice channel",
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: false
            }
        });
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);

        if(player) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Player already Exists for this Guild at: ${player.voiceChannel}`)
                ]
            });
        } else {
            player = await this.client.music.createSession({ guild: message.guild, text: message.channel, deaf: true, voice: message.member.voice.channel });

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Player has been Created at: ${player.voiceChannel}`)
                ]
            });
        }
    }
    async exec(interaction) {
        let player = this.client.music.playersMap.get(message.guild.id);
        if(player){
          return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Player already Exists for the Guild.`)
                ]
            });
        } else {
            await interaction.deferReply();
            player = await this.client.music.createSession({ guild: interaction.guild, text: interaction.channel, voice: interaction.member.voice.channel, deaf: true });

            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully Created a Player at: ${player.voiceChannel}`)
                ]
            });
        }
    }
}