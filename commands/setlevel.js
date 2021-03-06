const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    'aliases': ['setxp'],
    'description': 'Manages xp/level',
    execute (msg, args) {
        if (msg.member.hasPermission('MANAGE_GUILD')) {
            const level = require('../level.json');

            if (!level[msg.guild.id]) {
                level[msg.guild.id] = {};
            }
            /* eslint-disable-next-line no-magic-numbers */
            const usrMen = (/([0-9]+)/u).test(args[1]) ? args[1].match(/([0-9]+)/u)[1] : msg.author.id;
            let setType;
            /* eslint-disable-next-line no-magic-numbers */
            if (args[2].startsWith('+')) {
                setType = 'p';
                /* eslint-disable-next-line no-magic-numbers */
            } else if (args[2].startsWith('-')) {
                setType = 'n';
            } else {
                setType = 'none';
            }
            /* eslint-disable-next-line no-magic-numbers */
            const num = (/([0-9]+)/u).test(args[2]) ? parseInt(args[2].match(/([0-9]+)/u)[1], 10) : 1;

            if (!level[msg.guild.id][usrMen]) {
                msg.channel.send(`:x: **${msg.author.username}** that user hasn't gained xp yet.`);
            /* eslint-disable-next-line no-magic-numbers */
            } else if (args[0].toLowerCase() === 'xp') {
                if (setType === 'p') {
                    level[msg.guild.id][usrMen].xp += num;
                } else if (setType === 'n') {
                    /* eslint-disable-next-line no-magic-numbers */
                    if (level[msg.guild.id][usrMen].xp - num < 0) {
                        level[msg.guild.id][usrMen].xp = 0;
                    } else {
                        level[msg.guild.id][usrMen].xp -= num;
                    }
                    /* eslint-disable-next-line no-magic-numbers */
                } else if (num < 0) {
                    level[msg.guild.id][usrMen].xp = 0;
                } else {
                    level[msg.guild.id][usrMen].xp = num;
                }

                msg.guild.fetchMember(usrMen).then((tUser) => {
                    const emb = new Discord.RichEmbed().setColor('#f4c842').
                        setThumbnail(tUser.user.avatarURL).
                        addField('Changed xp', `**${tUser.user.username}'s** xp was changed to **${level[msg.guild.id][usrMen].xp}**`).
                        setFooter(`Changed by: ${msg.author.username}`, msg.author.avatarURL);
                    msg.channel.send(emb);
                });
                /* eslint-disable-next-line no-magic-numbers */
            } else if (args[0].toLowerCase() === 'level') {
                if (setType === 'p') {
                    level[msg.guild.id][usrMen].level += num;
                } else if (setType === 'n') {
                    /* eslint-disable-next-line no-magic-numbers */
                    if (level[msg.guild.id][usrMen].level - num < 1) {
                        level[msg.guild.id][usrMen].level = 1;
                    } else {
                        level[msg.guild.id][usrMen].level -= num;
                    }
                    /* eslint-disable-next-line no-magic-numbers */
                } else if (num < 1) {
                    level[msg.guild.id][usrMen].level = 1;
                } else {
                    level[msg.guild.id][usrMen].level = num;
                }

                msg.guild.fetchMember(usrMen).then((tUser) => {
                    const emb = new Discord.RichEmbed().setColor('#f4c842').
                        setThumbnail(tUser.user.avatarURL).
                        addField('Changed level', `**${tUser.user.username}'s** level was changed to **${level[msg.guild.id][usrMen].level}**`).
                        setFooter(`Changed by: ${msg.author.username}`, msg.author.avatarURL);
                    msg.channel.send(emb);
                });
            } else {
                /* eslint-disable-next-line no-magic-numbers */
                msg.channel.send(`:x: **${msg.author.username}** unknown argument "${args[0]}"`);
            }

            fs.writeFile('../level.json', JSON.stringify(level), 'utf8', (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    },
    'name': 'setlevel',
    'usage': 'setlevel <xp/level> <user> [+/-]<number>'
}