const BaseCommand = require("../../assets/baseCmd");

module.exports = class Ping extends BaseCommand {
    constructor(client) {
        super(client,{
            name: "ping",
            aliases: ["latency"],
            cat: "info",
            args: true,
            desc: "Shows the Latency with the Discord's API",
            ownerOnly: false,
        });
    }
    async run(message,args,prefix) {
        return await message.channel.send({
            content: `Discord API Latency: ${this.client.ws.ping} MS.`
        });
    }
    async exec(interaction) {
        return await interaction.reply({
            content: `Discord API Latency: ${this.client.ws.ping} MS.`
        })
    }
}