const Discord = require("discord.js");
const client = new Discord.Client({ 
    partials: ["REACTION", "MESSAGE"],
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const request = require('request');

const config = require("./config.json");
const { prefix } = config;
const command = require("./command");

client.on('ready', () => {
    console.log("electricSoda's bot is now online. Prepare the thrusters.");

    client.user.setActivity("soccer while high on soda.", {
        type: "PLAYING"
    });

    var activity = false;

    setInterval(function() {
        if (activity) {
            client.user.setActivity("soccer while high on soda.", {
                type: "PLAYING"
            });
            activity = false;
        } else {
            client.user.setActivity("for .help", {
                type: "WATCHING"
            });
            activity = true;
        }
    }, 10000)


    command(client, ['donalddump', 'dd', 'donaldtrump', 'tronalddump'], message => {
        request({
                method: "GET",
                url: 'https://api.tronalddump.io/random/quote',
                headers: {
                    accept: 'application/hal+json',
                }                
        },
        (error, response, body) => {
            var importedJSON = JSON.parse(body);
            message.channel.send("**Dumb Donald (Trump) Quote:**");
            message.channel.send(importedJSON.value)
        })
    })

    command(client, ['cn', 'chucknorris'], message => {
        request({
                method: "GET",
                url: 'https://api.chucknorris.io/jokes/random',
                headers: {
                    accept: 'application/json',
                }                
        },
        (error, response, body) => {
            var importedJSON = JSON.parse(body);
            message.channel.send("**Chuck Norris Joke:**");
            message.channel.send(importedJSON.value)
        })
    })

    command(client, ['chugsoda', 'soda'], message => {
        message.channel.send("https://bestanimations.com/media/soda/550127626soda-animated-gif-1.gif")
    })

    command(client, ['chug', 'c'], message => {
        sp = message.content.slice(prefix.length).trim().split(" ");

        for (let i=0; i < sp[2]; i++) {
            message.channel.send(sp[1] + " chug", { tts: true })
        }
    })

    command(client, ["help", 'h'], message => {
        const embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setDescription('Here\'s the help section >.<')
            .setAuthor('Soda Bot', 'https://i.ibb.co/yph4tm8/PROFILE-PIC.png', "https://github.com/electricSoda/")
            .addFields(
                { name: "Prefix", value: "Prefix for this server is `.`"},
                { name: 'Commands:', value: "List of commands for the server."},
                { name: 'Command', value: `\`.help\` - displays a list of available commands
                                            \`.tronalddump\` - stupid Donald Trump quotes
                                            \`.chucknorris\` - Chuck Norris jokes
                                            \`.chugsoda\` - Chug soda
                                            \`.chug [name] [count]\` - Pings someone you want to chug with
                `, inline: true },
                { name: "Aliases", value: `\`\help, h\`
                                            \`tronalddump, dd, donalddump, donaldtrump\`
                                            \`chucknorris, cn\`
                                            \`chugsoda, soda\`
                                            \`chug\`
                `, inline: true },
                { name: "-----------------------------------------------------------------", value: "\u200B"}
            )
            .setTimestamp()
            .setFooter("Made by electricSoda#9064")

        message.channel.send({embeds: [embed]})
    })
});

client.login(config.token);