const express = require('express');
const fs = require('fs');
const util = require('../util');
const EOL = require('os').EOL;

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
});

app.get('/artist', (req, res) => {
});

app.get('/artist/:artist', (req, res) => {
});

app.get('/album', (req, res) => {
});

app.get('/album/:album', (req, res) => {

});

app.get('/playlist', (req, res) => {
});

app.get('/playlist/:playlist', (req, res) => {
});

app.get('/song/', (req, res) => {

});

app.get('/song/:songId', (req, res) => {
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});