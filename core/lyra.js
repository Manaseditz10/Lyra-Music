const { Client } = require("discord.js");

class Lyra extends Client {
    constructor(clientOptions) {
        super(clientOptions);
        this.config = require("../config/vars.js");
        this.logger = require("../assets/logger.js");
        this.handler = new (require("../core/handler.js"))(this);
    }
    start() {
        this.handler.handle();
        this.login(this.config.token);
    }
}

module.exports = Lyra;