const { checkUrl } = require("../assets/functions");

module.exports = class BasePlayer {
    constructor(player, options) {
        this.player = player;
        this.textChannel = options.textChannel;
        this.voiceChannel = options.voiceChannel;
        this.data = new Map();
        this.guild = options.guild;
        this.queue = [];
        this.loopMode = "off";
        this.setupData = options.setupData ? options.setupData : null;
        this.current = options.track ?? null;
        this.previous = null;
        this.handlePlayer();
    }
    handlePlayer() {
        require("fs").readdirSync(`./events/player/`).forEach((file) => {
            if (file.endsWith(".js")) {
                let event = require(`../events/player/${file}`);
                event = new event(this);
                this.player.on(event.eventName, event.run.bind(event));
            }
        });
    }
    async search(query) {
        let res = await this.player.node.rest.resolve(checkUrl(query) ? query : `ytsearch:${query}`);

        return res;
    }
    isPlaying() {
        return this.current !== null ? true : false;
    }
    isPaused() {
        return this.player.paused;
    }
    async play() {
        if (!this.queue.length) {
            let client = this.player.node.manager.connector.client;

            let data = await client.db.getAfkData(this.guild.id);

            if(!data || !data.enabled) return;
            else {
                let voiceChannel = this.guild.channels.cache.get(data.voiceChannel) || await this.guild.channels.fetch(data.voiceChannel).catch(() => {});
                let textChannel = this.guild.channels.cache.get(data.textChannel) || await this.guild.channels.fetch(data.textChannel).catch(() => {});

                return;
            } 
        }
        this.current = this.queue.shift();
        await this.player.playTrack({ track: this.current.encoded });
    }
    async skip() {
        await this.player.stopTrack();
    }
    async pause() {
        return await this.player.setPaused(true);
    }
    async resume() {
        return await this.player.setPaused(false);
    }
    getVolume() {
        return this.player.volume;
    }
    async setVol(n) {
        await this.player.setGlobalVolume(n);
    } 
    async stop() {
        this.queue.length = 0;
        this.current = null;
        this.previous = null;
        await this.player.stopTrack();
    }
    async destroy() {
        let client = this.player.node.manager.connector.client;

        this.queue.length = 0;
        this.current = null;
        this.previous = null;
        this.player.destroy();

        this.data.get("nowPlayingMsg")?.delete()?.catch((e) => { });
        this.data.delete("nowPlayingMsg");
    }
    async autoPlay() {
        let client = this.player.node.manager.connector.client;
        let id = this.data.get("autoPlayId") || "_XBVWlI8TsQ";
        console.log(id);
        let query = `https://youtube.com/watch?v=${id}&list=RD${id}`;
        let result = await this.search(query);
        console.log(result);

        if (!result.data || !result.data.tracks || !result.data.tracks.length) return;
        try {
            let track = result.data.tracks[Math.floor(Math.random() * result.data.tracks.length)];
            track.requester = client.user;
            this.current = track;
            await this.player.playTrack({ track: this.current.encoded });

            return;
        } catch (e) {
            id = this.current.info.identifier || this.previous.info.identifier;
            return await this.autoPlay();
        }
    }
    async setBass() {
        await this.player.setEqualizer([
            { band: 0, gain: 0.1 },
            { band: 1, gain: 0.1 },
            { band: 2, gain: 0.05 },
            { band: 3, gain: 0.05 },
            { band: 4, gain: -0.05 },
            { band: 5, gain: -0.05 },
            { band: 6, gain: 0 },
            { band: 7, gain: -0.05 },
            { band: 8, gain: -0.05 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.05 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0.1 },
            { band: 13, gain: 0.1 },
        ]);
    }
    async set8d() {
        await this.player.setRotation({ rotationHz: val });
    }
    async setEarrape() {
        await this.player.setEqualizer([
            { band: 0, gain: 0.25 },
            { band: 1, gain: 0.5 },
            { band: 2, gain: -0.5 },
            { band: 3, gain: -0.25 },
            { band: 4, gain: 0 },
            { band: 6, gain: -0.025 },
            { band: 7, gain: -0.0175 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.0125 },
            { band: 11, gain: 0.025 },
            { band: 12, gain: 0.375 },
            { band: 13, gain: 0.125 },
            { band: 14, gain: 0.125 },
        ]);
    }
    async setElectronic() {
        await this.player.setEqualizer([
            { band: 0, gain: 0.375 },
            { band: 1, gain: 0.35 },
            { band: 2, gain: 0.125 },
            { band: 5, gain: -0.125 },
            { band: 6, gain: -0.125 },
            { band: 8, gain: 0.25 },
            { band: 9, gain: 0.125 },
            { band: 10, gain: 0.15 },
            { band: 11, gain: 0.2 },
            { band: 12, gain: 0.25 },
            { band: 13, gain: 0.35 },
            { band: 14, gain: 0.4 },
        ]);
    }
    async setTremolo() {
        await this.player.setTremolo({
            depth: 0.3,
            frequency: 14,
        });
    }
    async setSoft() {
        await this.player.setLowPass({ lowPass: { smoothing: 20.0 } });
    }
    async setSpeed() {
        await this.player.setTimescale({
            speed: 1.501,
            pitch: 1.245,
            rate: 1.921
        });
    }
    async setKaraoke() {
        await this.player.setKaraoke({
            karaoke: {
                level: 1.0,
                monoLevel: 1.0,
                filterBand: 220.0,
                filterWidth: 100.0
            }
        });
    }
    async setNightCore() {
        await this.player.setTimescale({
            speed: 1.3,
            pitch: 1.3
        });
    }
    async setPop() {
        await this.player.setEqualizer([
            { band: 0, gain: -0.25 },
            { band: 1, gain: 0.48 },
            { band: 2, gain: 0.59 },
            { band: 3, gain: 0.72 },
            { band: 4, gain: 0.56 },
            { band: 6, gain: -0.24 },
            { band: 8, gain: -0.16 },
        ]);
    }
    async clearFilters() {
        await this.player.setFilters({});
    }
    async seek(position) {
        await this.player.seekTo(position);
    }
}