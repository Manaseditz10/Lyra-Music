const { EmbedBuilder } = require("discord.js");
const BaseCommand = require("../../assets/baseCmd");

module.exports = class Profile extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "profile",
            aliases: ['badges'],
            cat: "info",
            desc: "shows the profile for the user",
            args: false,
            options: [{
                name: "user",
                type: 6,
                description: "gets the user",
                required: true
            }],
            ownerOnly: false,
            usage: "<user>",
            // voiceSettings:s
        })
    }
    async run(message, args, prefix) {
        let user;

        if (message.mentions.users.filter(x => x !== this.client.user).first()) {
            user = message.mentions.users.filter(x => x !== this.client.user).first();
        }

        else if (args[0] && !user) {
            user = this.client.users.cache.get(args[0]);
            if (!user) {
                user = await this.client.users.fetch(args[0]).catch(() => { });
            }
        }

        else if (!user && !args[0]) user = message.author;


        let guild = this.client.guilds.cache.get(this.client.config.supportId);
        if (!guild) guild = await this.client.guilds.fetch(this.client.config.supportId).catch(() => { });


        if (!guild) return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} There is some bug around this Command. Ask the support to fix it.`)
            ]
        });


        let member = guild.members.cache.get(user.id) || (await guild.members.fetch(user).catch((e) => { }));

        if (!member)
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(this.client.config.color).setDescription(`${this.client.emoji.cross} ${user.globalName ? user.globalName : user.username} is not There in the Support Server. Kindly join [Support Server](${this.client.config.serverLink}) to get some Badges on your Profile.`)
                ]
            });

        let badge = "";
        let roles = member?.roles.cache;
        let badges = require("./badges.json");
        if(roles.has(badges.owner)) {
            badge += `\n${badges.emotes.owner} Owner`;
        }
        if(roles.has(badges.developer)) {
            badge += `\n${badges.emotes.developer} Developer`;
        }
        if(roles.has(badges.special)) {
            badge += `\n${badges.emotes.special} Special`;
        }
        if(roles.has(badges.vip)) {
            badge += `\n${badges.emotes.vip} Vip`;
        }
        if(roles.has(badges.friend)) {
            badge += `\n${badges.emotes.friend} Friend`;
        }
        if(roles.has(badges.owner)) {
            badge += `\n${badges.emotes.staff} Staff`;
        }
        if(roles.has(badges.moderator)) {
            badge += `\n${badges.emotes.moderator} Moderator`;
        }
        badge += `\n${badges.emotes.user} User`;


        return await message.channel.send({
            embeds: [
                new EmbedBuilder().setColor(this.client.config.color).setDescription(`__**Badges**__\n${badge}`).setAuthor({ name: `${member.user.username}'s Profile`, iconURL: member.user.displayAvatarURL({ forceStatic: false }) })
            ]
        });
    }
}