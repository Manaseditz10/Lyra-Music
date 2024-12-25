const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");
const { LoadType } = require("shoukaku");
const { humanizeTime, updateSetupQueue } = require("../../assets/functions");

module.exports = class Play extends BaseCommand {
    constructor(client) {
        super(client,{
            name: 'play',
            aliases: ['p'],
            cat: 'music',
            args: true,
            usage: "<query or url>",
            desc: "plays music into the voice channel",
            ownerOnly: false,
            voiceSettings: {
                vc: true,
                sameVc: true,
                player: false
            },
            options: [
                {
                    name: "query",
                    type: 3,
                    description: "accepts a song url or query",
                    required: true
                }
            ]
        })
    }
    async run(message,args,prefix) {
        let player = this.client.music.playersMap.get(message.guild.id);
        if(!player) player = await this.client.music.createSession({
             guild: message.guild, text: message.channel, voice: message.member.voice.channel, deaf: true
        });

        let query = args.join(" ");
        let result = await player.search(query);
        let i = 0;
        let track;
        switch(result.loadType) {
            case "error":
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Error while Searching the Query.`)
                    ]
                });
                break;
            case "empty":
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} No Tracks found for the Given Query.`)
                    ]
                });
                break;
            case "playlist":
                for(i = 0; i < result.data.tracks.length; i++) {
                    track = result.data.tracks[i];
                    track.requester = message.author;
                    player.queue.push(track);
                }
                await updateSetupQueue(this.client, player, message.guild);
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.queue} Added **${result.data.info.name}** to the Queue.`)
                    ]
                });
                if(!player.isPlaying()) {
                    await player.play();
                }
                break;
            case "track":
                track = result.data[0] || result.data;
                track.requester = message.author;
                player.queue.push(track);
                await updateSetupQueue(this.client, player, message.guild);
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.queue} Added *[${track.info.title.substring(0,45)}](${this.client.config.serverLink})* : \`(${humanizeTime(track.info.length)})\``)
                    ]
                });
                if(!player.isPlaying()) {
                    await player.play();
                }
                break;
            case "search":
                track = result.data[0] || result.data;
                track.requester = message.author;
                player.queue.push(track);
                await updateSetupQueue(this.client, player, message.guild);
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.queue} Added *[${track.info.title.substring(0,45)}](${this.client.config.serverLink})* : \`(${humanizeTime(track.info.length)})\``)
                    ]
                });
                if(!player.isPlaying()) {
                    await player.play();
                }
                break;
        }
    }
    async exec(interaction) {
        let query = interaction.options.getString("query", true);
        if(!query) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Please provide me some Query to search.s`)
                ]
            });
        }

        let player = this.client.music.playersMap.get(interaction.guildId);
        await interaction.deferReply();
        if(!player) player = await this.client.music.createSession({
            guild: interaction.guild, 
            voice: interaction.member.voice.channel, 
            text: interaction.channel, 
            deaf: true,
        });
        player.textChannel = message.channel;
        let result = await player.search(query);

        let track;
        switch(result.loadType) {
            case "error":
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} Error while Searching the Query.`)
                    ]
                });
                break;
            case "playlist":
                for(let i = 0; i < result.data.tracks.length; i++) {
                    let track = result.tracks[i];
                    track.requester = interaction.user;
                    player.queue.push(track);
                }
                await updateSetupQueue(this.client, player, interaction.guild);
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.queue} Successfully Added **[${result.data.info.name}](${this.client.config.serverLink})** to Queue.`)
                    ]
                });
                if(!player.isPlaying()) await player.play();
                break;
            case "track":
                track = result.tracks[0];
                track.requester = interaction.user;
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.queue} Added *[${result.tracks[0].info.title.substring(0,45)}](${this.client.config.serverLink})* : \`${humanizeTime(track.info.length)}\``)
                    ]
                });
                await updateSetupQueue(this.client, player, interaction.guild);
                if(!player.isPlaying()) await player.play();
                break;
            case "search":
                track = result.data[0];
                track.requester = interaction.user;
                player.queue.push(track);
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.queue} Added *[${result.data[0].info.title.substring(0,45)}](${this.client.config.serverLink})* : \`${humanizeTime(track.info.length)}\``)
                    ]
                });
                await updateSetupQueue(this.client, player, interaction.guild);
                if(!player.isPlaying()) await player.play();
                break;
            default:
                console.log(result);
                break;
        }
    }
}