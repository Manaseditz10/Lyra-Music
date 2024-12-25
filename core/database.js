const mongoose = require("mongoose");

module.exports = class Database {
    constructor(client) {
        this.client = client;
        this.guilds = mongoose.model("Guild", new mongoose.Schema({
            id: {
                type: String,
                required: true
            },
            prefix: {
                type: String,
                default: this.client.config.prefix
            },
            ignoreModule: {
                ignoredChannels: {
                    type: [String],
                    default: [],
                },
                adminBypass: {
                    type: Boolean,
                    default: false,
                },
                modsBypass: {
                    type: Boolean,
                    default: false
                }
            },
            setupSettings: {
                messageId: { 
                    type: String,
                    default: false,
                },
                channelId: {
                    type: String,
                    default: false,
                }
            }
        }));
        this.autoPlay = mongoose.model("autoplay", new mongoose.Schema({
            id: {
                type: String,
                required: true,
            },
            enabled: {
                type: Boolean,
                default: false
            }
        }));
        this.afkSettings = mongoose.model("afk", new mongoose.Schema({
            id: {
                type: String,
                required: true,
            },
            enabled: {
                type: Boolean,
                default: false,
            },
            textChannel: {
                type: String,
                default: null,
            },
            voiceChannel: {
                type: String,
                default: null
            }
        }));
        this.noPrefix = mongoose.model("noprefix", new mongoose.Schema({
            id: {
                type: String,
                default: null,
            },
            array: {
                type: [String],
                default: []
            },
            blacklistedUsers: {
                type: [String],
                default: []
            },
            blacklistedServers: {
                type: [String],
                default: []
            }
        }));
        this.playlist = mongoose.model("playlist", new mongoose.Schema({
            userId:{
                type: String,
                required: true,
            },
            tracks:{
                type: Array,
                default: [],
            },
            name: {
                type: String,
                required: true
            },
            created: {
                type: Number,
                required: true
            }
        }));
    }
    async connect() {
        await mongoose.connect(this.client.config.mongoURL, {
            autoIndex: true,
            family: 4
        });

        this.client.logger.ready(`Database Got Connected Successfully.`)
    }
    async getGuildData({ id }) {
        return await this.guilds.findOne({ id });
    }
    async getAfkData(id) {
        return await this.afkSettings.findOne({ id });
    }
    async enableAfK(guild, player) {
        return await this.afkSettings.updateOne({ id: guild.id }, {
            $set: {
                enabled: true,
                textChannel: player.textChannel.id,
                voiceChannel: player.voiceChannel.id
            }
        }, { upsert: true, runValidators: true, new: true });
    }
    async disableAfk(guild) {
        return await this.afkSettings.updateOne({ id: guild.id }, {
            $set: {
                enabled: false,
                textChannel: null,
                voiceChannel: null
            }
        }, { upsert: true });
    }
    async getAutoPlayData({ id }) {
        return await this.autoPlay.findOne({ id });
    }
    async updatePrefix({ id, prefix }) {
        return await this.guilds.updateOne(
            { id },
            {
                $set: {
                    prefix: prefix
                }
            },
            { upsert: true }
        );
    }
    async getAutoPlay({ id }) {
        return await this.autoPlay.findOne({ id });
    }
    async disableAutoplay(id) {
        return await this.autoPlay.updateOne(
            { id }, { $set: { enabled: false } }, { upsert: true, new: true, runValidators: true }
        )
    }
    async enableAutoplay(id) {
        return await this.autoPlay.updateOne(
            { id }, { $set: { enabled: true } }, { upsert: true, new: true, runValidators: true }
        )
    }
    async addIgnore(guild, channel) {
        return await this.guilds.updateOne(
            {id: guild.id} ,
            {
                $push: {
                    "ignoreModule.ignoredChannels": channel.id 
                }
            }, { upsert: true, new: true, runValidators: true}
        );
    }
    async removeIgnore(guild, channel) {
        return await this.guilds.updateOne(
            { id: guild.id },
            {
                $pull: {
                    "ignoreModule.ignoredChannels": channel.id
                }
            },
            {
                upsert: true, new: true, runValidators: true
            }
        );
    }
    async adminBypass(id) {
        return await this.guilds.updateOne(
            {id},{
                $set: {
                    "ignoreModule.adminBypass": (await this.guilds.findOne({id})).ignoreModule.adminBypass ? false : true
                }
            }, { upsert: true, runValidators: true, new: true }
        );
    }
    async modsBypass(id) {
        return await this.guilds.updateOne(
            {id},{
                $set: {
                    "ignoreModule.modsBypass": (await this.guilds.findOne({id})).ignoreModule.modsBypass ? false : true
                }
            }, { upsert: true, new: true, runValidators: true }
        );
    }
    async addNoPrefix(userId) {
        return await this.noPrefix.updateOne(
            {
                id: this.client.user.id
            },
            {
                $push: {
                    array: userId
                }   
            }, { upsert: true, new: true, runValidators: true }
        );
    }
    async removeNoPrefix(userId) {
        return await this.noPrefix.updateOne(
            {
                id: this.client.user.id
            },
            {
                $pull: {
                    array: userId
                }
            }, { upsert: true, new: true, runValidators: true }
        );
    }
    async getNoPrefixList() {
        return await this.noPrefix.findOne({ id: this.client.user.id });
    }
    async blacklistUser(user) {
        let db = await this.noPrefix.findOne({ id: this.client.user.id });
        db && db.blacklistedUsers.includes(user.id) ? await this.noPrefix.updateOne({ id: this.client.user.id }, {
            $pull: {
                blacklistedUsers: user.id
            }
        }, { upsert: true, new: true, runValidators: true }) : await this.noPrefix.updateOne({ id: this.client.user.id }, {
            $push: {
                blacklistedUsers: user.id
            }
        }, { upsert: true, new: true, runValidators: true });

        return await this.noPrefix.findOne({ id: this.client.user.id });
    }
    async blacklistGuild(guild) {
        let db = await this.noPrefix.findOne({ id: this.client.user.id });
        db && db.blacklistedServers.includes(guild.id) ? await this.noPrefix.updateOne({ id: this.client.user.id }, {
            $pull: {
                blacklistedServers: guild.id
            }
        }, { upsert: true, new: true, runValidators: true }) : await this.noPrefix.updateOne({
            id: this.client.user.id
        }, {
            $push: {
                blacklistedServers: guild.id
            }
        }, { upsert: true, new: true, runValidators: true }); 

        return await this.noPrefix.findOne({ id: this.client.user.id });
    }
    async createSetup({
        id, message, channel
    }) {
        return await this.guilds.updateOne(
            { id },
            {
                $set: {
                    "setupSettings.messageId": message.id,
                    "setupSettings.channelId": channel.id
                }
            }, { upsert: true, new: true, runValidators: true }
        );
    }
    async deleteSetup({
        id
    }) {
        return await this.guilds.updateOne(
            { id }, {
                $set: {
                    "setupSettings.messageId": null,
                    "setupSettings.channelId": null
                }
            }, { upsert: true, new: true, runValidators: true }
        );
    }
    async createPlaylist({ userId, name }) {
        return await this.playlist.create({
            userId, name, created: Math.round(Date.now() / 1000)
        });
    }
    async getPlaylists({ userId }) {
        return await this.playlist.find({ userId });
    }
    async getPlaylist({ userId, name }) {
        return await this.playlist.findOne({ userId, name });
    }
}