const BaseEvent = require("../../assets/baseEvent");

module.exports = class DebugEvent extends BaseEvent{
    constructor(client) {
        super(client, {
            name: "Debug",
            eventName: "debug",
        });
    }
    async run(debugMessage) {
        this.client.logger.debug(`\n\nClient Debugging:\n${debugMessage}`)
    }
}