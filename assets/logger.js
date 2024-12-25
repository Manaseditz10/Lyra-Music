const { Signale } = require("signale");


const loggerOptions = {
    disabled: false,
    interactive: false,
    logLevel: "info",
    scope: "Lyra",
    stream: process.stdout,
    config: {
        displayBadge: true,
        displayDate: true,
        displayTimestamp: true,
        displayLabel: true,
        displayScope: true,
    },
    types: {
        ready: {
            color: "greenBright",
            badge: "✅",
            label: "[READY]"
        },
        error: {
            color: "redBright",
            badge: "⛔",
            label: "[ERROR]"
        },
        log: {
            color: "magentaBright",
            label: "[LOG]",
            badge: "📝"
        },
        debug: {
            color: "cyanBright",
            label: "[DEBUG]",
            badge: "🐞"
        },
        warn: {
            color: "yellowBright",
            label: "[WARN]",
            badge: "⚠"
        },
        node: {
            color: "whiteBright",
            label: "[NODE]",
            badge: "🍃"
        },
        player: {
            color: "grey",
            label: "[PLAYER]",
            badge: "🎵"
        }
    }
}


class Logger extends Signale {
    constructor() {
        super(loggerOptions);
    }
    ready(...args) {
        return this.success(args.join(' '));
    }
}


module.exports = new Logger();