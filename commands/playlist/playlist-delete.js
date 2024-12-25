const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class PlaylistDelete extends BaseCommand {
    constructor(client) {
        super(client,{
            name: "playlist-delete",
            aliases: ['pl-delete', 'pldelete'],
            cat: "playlist",
            args: true,
            desc: "Deletes a playlist",
            options: [],
            ownerOnly: false,
            usage: "<name>",
            // voiceSettings: {}
        })
    }
    async run(message, args, prefix) {
        let name = args[0];

        let playlist = await this.client.db.getPlaylist({ userId: message.author.id, name });

        if(!playlist) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Such playlist Found.`)
                ]
            });
        }

        else {
            await playlist.deleteOne();

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Deleted the Playlist with Name: **${playlist.name}**`)
                ]
            });
        }
    }
}