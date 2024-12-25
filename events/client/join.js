const BaseEvent = require("../../assets/baseEvent");

module.exports = class GuildJoin extends BaseEvent {
    constructor(client) {
        super(client, {
            name: "guildCreate",
            eventName: "GuildJoin"
        });
    }
}