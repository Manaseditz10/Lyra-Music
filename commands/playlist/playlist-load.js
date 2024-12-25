const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class PlaylistLoad extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "playlist-load",
            aliases: ["pl-load"],
            cat: "playlist",
            args: true,
            usage: "<name>",
            desc: "Loads a playlist",
            options: [{
                name: "name",
                description: "playlist name",
                type: 3,
                required: true
            }],
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: true
            }
        })
    }
    async run(message, args, prefix) {
        if(!args[0]) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Playlist name.`)
                ]
            });
        }

        let playlist = await this.client.db.getPlaylist({ userId: message.author.id, name: args[0]});

        if(!playlist) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Such Playlist exists.`)
                ]
            });
        }

        let player = this.client.music.playersMap.get(message.guild.id);
        if(!player) {
            player = await this.client.music.createSession({
                guild: message.guild, text: message.channel, voice: message.member.voice.channel, deaf: true
           });
        }

        playlist.tracks.forEach((tr) => {
            player.queue.push(tr);
        });

        if(!player.isPlaying()) await player.play();

        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully Loaded the Playlist: **${playlist.name}**`)
            ]
        });
    }
}