module.exports = class BaseEvent {
    constructor(client,{
        name, eventName
    }) {
        this.client = client;
        this.name = name;
        this.eventName = eventName;
    }
    async run() {
        return new Promise((rej,res) => res());
    }
}