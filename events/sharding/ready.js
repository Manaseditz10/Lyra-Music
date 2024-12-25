const BaseEvent = require("../../assets/baseEvent");

module.exports = class ShardReady extends BaseEvent {
    constructor(sharder) {
        super(sharder, {
            name: "ShardReady",
            eventName: "clientReady",
        });
        this.sharder = sharder;
    }
    async run(event) {
        this.sharder.logger.ready("Client is Ready with Event ID:",event.clusterId);
    }
}