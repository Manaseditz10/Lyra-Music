const { Partials } = require("discord.js");
const { Indomitable } = require("indomitable");
const Lyra = require("./lyra");
const logger = require("../assets/logger.js");

class Sharder extends Indomitable {
    constructor() {
        super({
            autoRestart: true,
            clientOptions: {
                intents: [
                    "GuildMessages",
                    "GuildMembers",
                    "GuildInvites",
                    "GuildVoiceStates",
                    "MessageContent",
                    "Guilds"
                ],
                partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.ThreadMember],
                allowedMentions: {
                    repliedUser: false
                },
                failIfNotExists: true,
                rest: {
                    authPrefix: "Bot",
                    cdn: "https://cdn.discordapp.com/",
                    globalRequestsPerSecond: 45,
                    api: "https://discord.com/api/",
                    retries: 2,
                    version: "10",
                    hashSweepInterval: 2 * 60 * 60 * 1000,
                    timeout: 20000
                }
            },
            handleConcurrency: true,
            waitForReady: false,
            clusterCount: "auto",
            shardCount: "auto",
            token: require("../config/vars").token,
            client: Lyra
        });
        this.logger = logger;
        this.handleSharder();
    }
    handleSharder() {
        require("fs").readdirSync(`./events/sharding/`).forEach((file) => {
            let event = require(`../events/sharding/${file}`);
            event = new event(this);
            this.on(event.eventName, event.run.bind(event));
        });
    }
}

module.exports = Sharder;