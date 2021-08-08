const { prefix } = require("./config.json");

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases];
    }

    client.on("messageCreate", (message) => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const { content } = message;
        const args = content.slice(prefix.length).trim().split(" ");
        const command = args[0]
        
        aliases.forEach(alias => {
            if (command == alias || command === alias) {
                console.log(`Running ${command}`)
                callback(message)
            }
        })
    })
}