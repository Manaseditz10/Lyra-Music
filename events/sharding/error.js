const BaseEvent = require("../../assets/baseEvent");

module.exports = class ShardError extends BaseEvent {
    constructor(sharder) {
        super(sharder, {
            name: "ShardError",
            eventName: "error",
        });
        this.sharder = sharder;
    }
    async run(error) {
        this.sharder.logger.error(error);
    }
}