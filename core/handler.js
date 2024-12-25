const { readdirSync } = require("fs");
const Database = require("./database");
const LyraMusic = require("../modules/music");
const BaseDok = require("../assets/baseDok");

module.exports = class ClientHandler {
    constructor(client) {
        this.client = client;
        this.handled = false;
        this.handle();
    }
    handle() {
        if (this.handled) return this;
        else {
            this.loadContainer();
            this.loadDok();
            this.loadFiles();
            this.client.logger.ready(`THE HANDLER HAS HANDLED THE STUFF SUCCESSFULLY`);
            this.handled = true;
            return this;
        }
    }
    loadContainer() {
        this.client.emoji = require("../config/emotes.json");
        this.client.db = new Database(this.client);
        this.client.db.connect().then(() => {
            return new Promise((rej, res) => res()).catch((e) => { });
        });
        this.client.music = new LyraMusic(this.client);
        this.client.commands = new Map();
    }
    loadFiles() {
        this.loadCmds();
        this.loadEvents();
    }
    loadCmds() {
        readdirSync(`./commands/`).forEach(dir => {
            readdirSync(`./commands/${dir}/`).forEach((file) => {
                if (file.endsWith(".js")) {
                    let cmd = new (require(`../commands/${dir}/${file}`))(this.client);
                    this.client.commands.set(cmd.name, cmd);
                }
            })
        });
        this.client.logger.log(`Loaded Commands`);
    }
    loadEvents() {
        readdirSync(`./events/client/`).forEach((file) => {
            if (file.endsWith(".js")) {
                let event = new (require(`../events/client/${file}`))(this.client);
                let run = event.run.bind(event);
                this.client.on(event.eventName, run);
            }
        });

        this.client.logger.log(`Loaded Events`);
    }
    loadDok() {
        this.client.dokdo = new BaseDok(this.client);
    }
}