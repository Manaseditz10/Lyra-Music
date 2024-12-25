const BaseMusic = require("../core/shoukaku");
const BasePlayer = require("./player");

module.exports = class LyraMusic {
    constructor(client) {
        this.client = client;
        this.musicHandler = new BaseMusic(this.client);
        this.playersMap = new Map();
    }
    async createSession({ guild, text, voice, deaf }) {
        let player = await this.musicHandler.joinVoiceChannel({
            guildId: guild.id,
            channelId: voice.id,
            deaf: deaf ?? true,
            mute: false,
            shardId: guild.shard.id
        });
        let setupData = await this.client.db.getGuildData({ id: guild.id });
        let options = {
            textChannel: text,
            guild: guild,
            voiceChannel: voice,
            setupData: setupData?.setupSettings
        };
        player = new BasePlayer(player, options);
        this.playersMap.set(guild.id, player);
        return player;
    }
    async destroySession(id) {
        let db = this.playersMap.get(id);

        let afkData = await this.client.db.getAfkData(id);

        if (db) {
            this.playersMap.delete(id);
            this.musicHandler.leaveVoiceChannel(id);
            await db.player.destroy();

            if (afkData && afkData.enabled) {
                let text = db.guild.channels.cache.get(afkData.textChannel) || await db.guild.channels.fetch(afkData.textChannel) || db.textChannel;

                let voice = db.guild.channels.cache.get(afkData.voiceChannel) || await db.guild.channels.fetch(afkData.voiceChannel) || db.voiceChannel;

                let guild = db.guild;

                await this.createSession({ guild, text, voice, deaf: true });
            }

            return true;
        } else {
            return false;
        }
    }
}