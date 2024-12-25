const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    humanizeTime: humanizeTime,
    chunk: function (array, chunkSize) {
        if (!Array.isArray(array)) {
            throw Error("Chunking is not possible with the non-array type data.")
        }

        else {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                result.push(array.slice(i, i + chunkSize));
            }
            return result;
        }
    },
    checkUrl: function (string) {
        try {
            new URL(string);
            return true;
        } catch (e) {
            return false;
        }
    },
    createSetup: async function (client, guild, channel) {
        let content = `__**Queue List**__\n\nJoin a Voice Channel and type in your Search Query or a Url`;

        let embed = new EmbedBuilder().setColor(client.config.color).setTitle(`Nothing Playing right now`).setURL(client.config.serverLink).setImage(client.config.setupImg).setAuthor({
            name: `Nothing Playing Right Now.`,
            iconURL: client.user.displayAvatarURL({ forceStatic: false })
        }).setFooter({
            text: `Thanks for Choosing ${client.user.username}`,
            iconURL: guild.iconURL({ forceStatic: false })
        });


        let btn1 = new ButtonBuilder().setEmoji(client.emoji.setup.previous).setStyle(2).setCustomId("setup-previous");
        let btn2 = new ButtonBuilder().setEmoji(client.emoji.setup.stop).setStyle(2).setCustomId("setup-stop");
        let btn3 = new ButtonBuilder().setEmoji(client.emoji.setup.pause).setStyle(2).setCustomId("setup-pause");
        let btn4 = new ButtonBuilder().setEmoji(client.emoji.setup.loop).setStyle(2).setCustomId("setup-loop");
        let btn5 = new ButtonBuilder().setEmoji(client.emoji.setup.skip).setStyle(2).setCustomId("setup-skip");

        let btn6 = new ButtonBuilder().setEmoji(client.emoji.setup.volLow).setStyle(2).setCustomId("setup-volLow");
        let btn7 = new ButtonBuilder().setEmoji(client.emoji.setup.clearQueue).setStyle(2).setCustomId("setup-clearQueue");
        let btn8 = new ButtonBuilder().setEmoji(client.emoji.setup.shuffle).setStyle(2).setCustomId("setup-shuffle");
        let btn9 = new ButtonBuilder().setEmoji(client.emoji.setup.autoplay).setStyle(2).setCustomId("setup-autoplay");
        let btn10 = new ButtonBuilder().setEmoji(client.emoji.setup.volHigh).setStyle(2).setCustomId("setup-volHigh");

        let row1 = new ActionRowBuilder().addComponents([btn1, btn2, btn3, btn4, btn5]);
        let row2 = new ActionRowBuilder().addComponents([btn6, btn7, btn8, btn9, btn10]);

        let msg = await channel.send({ content, embeds: [embed], components: [row1, row2] });

        await client.db.createSetup({
            id: guild.id,
            message: msg,
            channel: channel
        });

        return;
    },
    deleteSetup: async function (client, guild) {
        await client.db.deleteSetup({ id: guild.id });

        return;
    },
    playSetup: async function ({ client, message, guild, channelId, messageId }) {
        if (message.author.bot) {
            await message.delete().catch(() => { });
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.cross} Bot's Query is not Allowed.`)
                ]
            }).then((msg) => {
                setTimeout(async () => {
                    await msg.delete().catch((e) => { });
                }, 5000);
            });
        }

        let player = client.music.playersMap.get(guild.id);

        let channel = guild.channels.cache.get(channelId);
        if (!channel) {
            channel = await guild.channels.fetch(channelId).catch(() => { });
        }

        if (!channel) channel = message.channel;

        if (!player) {
            player = await client.music.createSession({
                guild: guild,
                deaf: true,
                text: channel,
                voice: message.member.voice.channel
            });
        }

        player.textChannel = message.channel;

        let query = message.content;
        await message.delete().catch(() => { });
        let result = await player.search(query);

        switch (result.loadType) {
            case "empty":
                return await message.channel.send({
                    content: `${client.emoji.cross} Couldn't Search any Track for the given Query.\nRequested By: ${message.author.globalName ?? message.author.username}`
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(e => { });
                    }, 5000);
                });
                break;
            case "error":
                return await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.cross} Error while Searching the Query.\nRequested By: ${message.author.globalName ?? message.author.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(() => { });
                    }, 5000);
                });
                break;
            case "playlist":
                for (i = 0; i < result.data.tracks.length; i++) {
                    track = result.data.tracks[i];
                    track.requester = message.author;
                    player.queue.push(track);
                }
                await updateSetupQueue(client, player, guild);
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.queue} Added **${result.data.info.name}** to the Queue.\n${client.emoji.requester} Requested By: ${message.author.globalName ?? message.author.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch((e) => { });
                    }, 5000);
                });
                if (!player.isPlaying()) {
                    await player.play();
                }
                break;
            case "track":
                track = result.data[0] || result.data;
                track.requester = message.author;
                player.queue.push(track);
                await updateSetupQueue(client, player, guild);
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.queue} Added *[${track.info.title.substring(0, 45)}](${client.config.serverLink})* : \`(${humanizeTime(track.info.length)})\`\n${client.emoji.requester} Requested By: ${message.author.globalName ?? message.author.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(() => { });
                    }, 5000);
                });
                if (!player.isPlaying()) {
                    await player.play();
                }
                break;
            case "search":
                track = result.data[0];
                track.requester = message.author;
                player.queue.push(track);
                await updateSetupQueue(client, player, guild);
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder().setColor(client.config.color).setDescription(`${client.emoji.queue} Added *[${track.info.title.substring(0, 45)}](${client.config.serverLink})* : \`(${humanizeTime(track.info.length)})\`\n${client.emoji.requester} Requested By: ${message.author.globalName ?? message.author.username}`)
                    ]
                }).then((msg) => {
                    setTimeout(async () => {
                        await msg.delete().catch(() => { });
                    }, 5000);
                });
                if (!player.isPlaying()) {
                    await player.play();
                }
                break;
        }

        return;
    },
    updateSetupQueue: updateSetupQueue,
}


function humanizeTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours > 0) ? (hours < 10 ? "0" + hours : hours) + ":" : "";
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + minutes + ":" + seconds;
}


async function updateSetupQueue(client, player, guild) {
    console.log("Update Working");
    console.log(player.setupData);
    let setupSettings = player.setupData;
    console.log(setupSettings);

    let channel = guild.channels.cache.get(setupSettings?.channelId);
    if (!channel) {
        channel = await guild.channels.fetch(setupSettings?.channelId).catch(() => { });
    }

    if (!channel && setupSettings && setupSettings.channelId) {
        await deleteSetup(client, guild);
        return;
    }

    let content = ``;

    let msg = channel?.messages?.cache?.get(setupSettings?.messageId);
    if (!msg) {
        msg = await channel?.messages?.fetch(setupSettings?.messageId).catch(() => { });
    }

    if (msg) {
        let queue = player.queue;
        console.log(queue);
        if (!queue.length) content = `__**Queue List**__\n\nJoin a Voice Channel and type in your Search Query or a Url`;

        else if (queue.length) {
            queue = queue.length >= 10 ? queue.splice(0, 10) : queue;

            content = `__**Queue List**__\n${queue.map((x, i) => {
                `${i + 1}. [${x.info.title.substring(0, 25)}](${client.config.serverLink}) *${x.requester.globalName ? x.requester.globalName : x.requester.username}*`
            }) + "\n*May be more in Queue*....."}\n\nJoin a Voice Channel and type in your Search Query or a Url`;


            await msg.edit({ content }).catch((e) => { });
        }
    }
    return;
}