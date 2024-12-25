const BaseEvent = require("../../assets/baseEvent");
const { updateSetupQueue } = require("../../assets/functions");

module.exports = class PlayerClose extends BaseEvent{
    constructor(player) {
        super(player, {
            name: "PlayerClose",
            eventName: "close",
        });
        this.player = player;
        this.client = player.player.node.manager.connector.client;
    }
    async run() {
        updateSetupQueue(this.client, this.player, this.player.guild);
        return this.player.player.node.manager.connector.client.music.destroySession(this.player.guild.id).catch((e) => {});
    }
}