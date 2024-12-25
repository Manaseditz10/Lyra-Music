const BaseEvent = require("../../assets/baseEvent");

module.exports = class ShardDebug extends BaseEvent {
    constructor(sharder) {
        super(sharder, {
            name: "ShardDebug",
            eventName: "debug"
        });
        this.sharder = sharder;
    }
    async run(message) {
        this.sharder.logger.debug("Sharding Debugging:\n", message, "\n\n")
    }
}