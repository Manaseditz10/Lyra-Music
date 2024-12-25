const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class PlaylistShow extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "playlist-show",
            aliases: ["pl-show"],
            cat: "playlist",
            args: false,
            desc: "Shows the playlist of the User",
            options: [],
            ownerOnly: false,
        })
    }
    async run(message, args, prefix) {
        // let arg = args[0]

        let playlists = await this.client.db.getPlaylists({ userId: message.author.id });

        if (!playlists.length) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There are no Playlists you have Created.`)
                ]
            });
        }

        let msg = [];

        for (let i = 0; i < playlists.length; i++) {
            let pl = playlists[i];

            msg.push(`**${i + 1}.** *[${pl.name}](https://discord.com/users/${message.author.id})* Tracks: ${pl.tracks.length} Created: <t:${pl.created}>`);
        }


        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color)
                    .setTitle(`Playlist Information`).setDescription(`${msg.sort().join("\n")}`).setThumbnail(message.author.displayAvatarURL({ forceStatic: false })).setTimestamp()]
        });
    }
}