const express = require('express');
const fs = require('fs');
const util = require('../util');
const EOL = require('os').EOL;
const webInterface = require('../web-interface')

const app = express();
const port = 4041;

const createPLS = (hostname, ids) => {
    let plsString = '[playlist]';
    let i = 0;
    for (let id of ids) {
        plsString += EOL + 'File' + (++i).toString() + '=';
        plsString += 'http://' + hostname + ':' + port + '/song/' + id.toString();
    }
    plsString += EOL + 'NumberOfEntries=' + ids.length;
    return plsString;
}

app.get('/', (req, res) => {
    webInterface.getHomepage().then((homepage) => {
        res.send(homepage);
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/artists', (req, res) => {
    res.sendStatus(404);
});

app.get('/artists/:artist', (req, res) => {
    res.sendStatus(404);
});

app.get('/albums', (req, res) => {
    res.sendStatus(404);
});

app.get('/albums/:album', (req, res) => {
    res.sendStatus(404);
});

app.get('/playlists', (req, res) => {
    res.sendStatus(404);
});

app.get('/playlists/:playlist', (req, res) => {
    res.sendStatus(404);
});

app.get('/songs/', (req, res) => {
    res.sendStatus(404);
});

app.get('/songs/:songId', (req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});