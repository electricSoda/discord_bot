// Main website
const express = require('express');
const parser = require('body-parser');

const fs = require('fs');

const app = express();

app.use(express.static('public'))

var ueparser = parser.urlencoded({ extended: false })
var json_file = require('./links.json');

app.post("/new-link", ueparser, (req, res) => {
    json_file.links.push(req.body.link)
    fs.writeFile("./links.json", JSON.stringify(json_file, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
    });
    return res.sendFile('/public/index.html', {root: __dirname })
})

app.listen(3000, (req, res) => {
    console.log("Server online.")
});

// Bot
const Discord = require("discord.js");
const client = new Discord.Client({ 
    partials: ["REACTION", "MESSAGE"],
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"]
});

const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const request = require('request');

const prefix = "."
const command = require("./command");

var vendingmachine = {
    "Tier 1 Soda": "2 pops",
    "Tier 2 Soda": "8 pops",
    "Tier 3 Soda": "1 fiz 9 pops",
    "Premium Soda": "4 fiz 2 pops",
    "Stale Pancake": "1 pop",
    "Premium Syrup Glazed Pancake": "3 fiz 1 pop",
    "Freshly Picked Mushroom": "5 pops",
    "Mushroom Stew": "1 fiz 7 pops"
}

client.on('ready', () => {
    console.log("electricSoda's bot is now online. Prepare the thrusters.");

    client.user.setActivity("soccer while high on soda.", {
        type: "PLAYING"
    });

    var activity = false;
    var current = 0;

    var act = setInterval(() => {
        console.log(current)
        if (current == 86400 * 1000) {
            var new_json = require("./links.json");
            if (new_json.links.length != 0) {
                client.channels.cache.get('842795588272521276').send("Daily dose of tiktok (from Victor): " + new_json.links[0]);
                new_json.links.splice(0, 1);
                fs.writeFile("./links.json", JSON.stringify(new_json, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                });
                console.log("said")
            } else {
                client.channels.cache.get('842795588272521276').send("There are no more tiktoks :(");
                console.log("sent")
            }
            current = 0;
        }
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
        current = current + 10000
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

    command(client, ['vendingmachine', 'vm'], message => {
        const embed = new Discord.MessageEmbed()
            .setTitle("Vending Machine")
            .setDescription("Ouh hey look it's **food**")
            .setAuthor('Soda Bot', 'https://i.ibb.co/yph4tm8/PROFILE-PIC.png', "https://github.com/electricSoda/")
            .addFields(
                { name: "Food", value: `\`Tier 1 Soda\`
                                        \`Tier 2 Soda\`
                                        \`Tier 3 Soda\`
                                        \`Premium Soda\`
                                        \`Stale Pancake\`
                                        \`Premium Syrup Glazed Pancake\`
                                        \`Freshly Picked Mushroom\`
                                        \`Mushroom Stew\`
                `, inline: true},
                { name: "Price", value: `\`2 pops\`
                                        \`8 pops\`
                                        \`1 fiz 9 pops\`
                                        \`4 fiz 2 pops\` 
                                        \`1 pop\`                       
                                        \`3 fiz 1 pop\` 
                                        \`5 pops\`
                                        \`1 fiz 7 pops\`
                `, inline: true}
            )
            .setTimestamp()
            .setFooter("Made by electricSoda#9064")
        
        message.channel.send({embeds: [embed]})
    })

    command(client, ['buy', 'b'], message => {
        const args = message.content.slice(prefix.length).trim().split(`"`);
        args.shift(); // remove the first argument (the command)
        args.pop();

        if (args[0] in vendingmachine) {
            let price = vendingmachine[args[0]]
            message.channel.send("You bought " + args[0])
            message.channel.send("Price: " + price)
            message.channel.send("And you just wasted a couple seconds of your life trying to buy a virtual item. ¯\_(ツ)_/¯")
        } else {
            message.channel.send("That item does not exist!")
        }
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

    command(client, ['join'], message => {
        var channel = message.member.voice.channel
        if (!channel) {
            message.reply("You are not in a voice channel.")
            return
        } else {
            channel = client.channels.get(channel.id)
            channel.join().then(connection => {
                console.log("connected")
            }).catch(e => {
                console.error(e)
            })
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
                                            \`.vendingmachine\` - Shows available snacks
                                            \`.buy "[food]"\` - Gets food from the vending machine.
                                            \`.join\` - Joins your voice channel and RAHAHAHHA
                `, inline: true },
                { name: "Aliases", value: `\`\help, h\`
                                            \`tronalddump, dd, donalddump, donaldtrump\`
                                            \`chucknorris, cn\`
                                            \`chugsoda, soda\`
                                            \`chug, c\`
                                            \`vendingmachine, vm\`
                                            \`buy, b\`
                                            \`join\`
                `, inline: true },
                { name: "-----------------------------------------------------------------", value: "\u200B"}
            )
            .setTimestamp()
            .setFooter("Made by electricSoda#9064")

        message.channel.send({embeds: [embed]})
    })
});

client.login(process.env.token);
console.log(process.env.token)