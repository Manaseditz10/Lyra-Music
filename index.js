// const Sharder = require("./core/sharder");
const { Partials } = require("discord.js");
const Lyra = require("./core/lyra");

// const manager = new Sharder();
// manager.spawn();

const LyraBot = new Lyra({
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
});

LyraBot.start();

process.on("unhandledRejection", (e) => {
    console.log(e);
});

process.on("uncaughtException", (e) => {
    console.log(e);
});