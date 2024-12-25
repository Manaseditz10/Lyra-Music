const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class AddCurrent extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "playlist-addcurrent",
            aliases: ['pl-addcurrent'],
            cat: "playlist",
            args: false,
            desc: "Adds the current song to the playlist",
            options: [],
            ownerOnly: false,
            usage: "<name>",
        })
    }
    async run(message, args, prefix) {
        let player = this.client.music.playersMap.get(message.guildId);

        if(!player) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is no Player in this Guild currently.`)
                ]
            });
        }

        if(!player.isPlaying()) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played currently.`)
                ]
            });
        }

        let current = player.current;

        if(!current) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Track is being Played currently.`)
                ]
            });
        }

        if(!args[0]) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Playlist name.`)
                ]
            });
        }

        let plData = await this.client.db.getPlaylist({ userId: message.author.id, name: args[0] });

        if(!plData) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Such playlist exists.`)
                ]
            });
        }

        let flag = false;
        let track = searchTrack(plData.tracks, current);
        if(track) flag = true;

        console.log(track);

        if(flag) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Current Song already exists in the Playlist: *${plData.name}*`)
                ]
            });
        }

        else {
            plData.tracks.push(current);
            await plData.save();

            console.log(plData);

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully Added [${current.info.title.substring(0, 45)}](${this.client.config.serverLink}) to the Playlist: *${plData.name}*`)
                ]
            });
        }

        return;
    }
}

function searchTrack(playlist, track) {
    for(let i = 0; i < playlist; i++) {
        console.log(playlist[i].encoded);

        console.log(playlist[i]);
        if(playlist[i].encoded == track.encoded) {
            return true;
        }
    }

    return false;
}