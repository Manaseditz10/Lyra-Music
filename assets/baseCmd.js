module.exports = class BaseCommand {
    constructor(client, {
        name, cat, desc, ownerOnly, usage, args, voiceSettings, aliases, options
    }) {
        this.client = client;
        this.aliases = aliases ?? [];
        this.name = name;
        this.description = desc;
        this.category = cat ?? "";
        this.ownerOnly = ownerOnly ?? false;
        this.args = args ?? false;
        this.usage = usage ?? "";
        this.voiceSettings = {
            vc: voiceSettings ? voiceSettings.vc : false,
            sameVc: voiceSettings ? voiceSettings.sameVc : false,
            player: voiceSettings ? voiceSettings.player : false
        };
        this.options = options ?? [];
    }
    async run() {
        return new Promise((reject,resolve) => resolve());
    }
    async exec() {
        return new Promise((reject,resolve) => resolve());
    }
}