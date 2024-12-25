const BaseEvent = require("../../assets/baseEvent");

module.exports = class Ready extends BaseEvent {
    constructor(client) {
        super(client,{
            name: 'Ready',
            eventName: 'ready'
        })
    }
    async run() {
        this.client.logger.ready(`Client is ready with Username: ${this.client.user.username}`);
        let cmds = [];
        this.client.commands.forEach((cmd) => {
            if(cmd.name && cmd.description) {
                cmds.push(cmd);
            }
        });
        this.client.application?.fetch().then(async (application) => {
            await application.commands.set(cmds).catch((e) => this.client.logger.error(e)).then(() => {
                this.client.logger.ready(`Loaded the Slash for All the Guilds.`);
            });
        });
    }
}