const Dokdo = require("dokdo");

module.exports = class BaseDok extends Dokdo.Client {
    constructor(client) {
        super(client,
            {
                aliases: ["dok", "jsk", "eval"],
                prefix: client.config.prefix,
                owners: client.config.owners
            }
        );
    }
}