const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class PlaylistCreate extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "playlist-create",
            aliases: ['pl-create', 'plcreate'],
            args: false,
            cat: "playlist",
            desc: "Creates a playlist",
            options: [],
            ownerOnly: false,
            usage: "<name>",
            voiceSettings: {
                vc: false,
                sameVc: false,
                player: false
            }
        });
    }
    async run(message, args, prefix) {
        let userData = await this.client.db.getPlaylists({ userId: message.author.id });

        if(userData.length >= 5) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} You cannot create more Playlists. (Limit = 5)`)
                ]
            });
        }

        let name = args[0];

        if(!name) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me a Playlist Name.`)
                ]
            });
        }

        if(name.length > 10) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Playlist Name is too Large.`)
                ]
            });
        }

        let exists = false;

        for(let i = 0; i < userData?.length; i++) {
            if(userData[i]?.name.toLowerCase() === name.toLowerCase()) {
                exists = true;
                break;
            }
        }

        if(exists) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Playlist with Same name Already exists.`)
                ]
            });
        }

        await this.client.db.createPlaylist({
            userId: message.author.id,
            name
        });


        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.tick} Successfully Created the Playlist with Name: **${name}**`)
            ]
        });
    }
}