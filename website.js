// Main website
const express = require('express');
const parser = require('body-parser');

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, (req, res) => {
    console.log("Server online.")
});