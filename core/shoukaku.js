const { Shoukaku, Connectors } = require("shoukaku");

module.exports = class BaseMusic extends Shoukaku {
    constructor(client) {
        super(new Connectors.DiscordJS(client), client.config.nodes, {
            nodeResolver(nodes, connection) {
                let connections = [];
                nodes.forEach((node) => connections.push(node));
                return getLeastUsedNode(connections);
            },
            moveOnDisconnect: false,
            resume: true,
            resumeTimeout: 10000,
            reconnectInterval: 10000,
            reconnectTries: 5,
            voiceConnectionTimeout: 10000,
        });
        this.on("ready", (name, reconnected) => {
            client.logger.node(`Node Got Successfully Connected: ${name} It is ${reconnected ? "":"not"} a Reconnection.`);
        });
        this.on("error", (name, error) => {
            client.logger.error(`Node Got Some Errors: `+error);
        });
    }
    handleNodes(shoukaku) {
        require("fs").readdirSync(`./events/node/`).forEach((file) => {
            if(file.endsWith(".js")) {
                require(`../events/node/${file}`)(shoukaku);
            }
        });
    }
}

function getLeastUsedNode(nodes) {
    let node = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
        if (node?.stats?.memory?.free < nodes[i]?.stats?.memory?.free) {
            node = nodes[i];
        }
    }

    return node;
}