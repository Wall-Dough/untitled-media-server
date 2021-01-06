const express = require('express');
const fs = require('fs');
const util = require('../util');
const webInterface = require('../web-interface');
const manager = require('../manager');

const app = express();
const port = 4041;

// This is the MIME type for a different kind of .pls file, but it's the only .pls type
//  recognized by the MIME type library that express uses
const PLS_MIME_TYPE = 'application/pls+xml';

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

app.get('/albums/:albumId', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        const songIds = songs.map((song) => {
            return song.id;
        });
        const playlist = util.createPLS(`${req.hostname}:${port}`, songIds);
        res.type(PLS_MIME_TYPE);
        res.send(playlist);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.send(err);
    });
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
    manager.getSongById(Number(req.params.songId)).then((song) => {
        const playlist = util.createPLS(`${req.hostname}:${port}`, [song.id]);
        res.type(PLS_MIME_TYPE);
        res.send(playlist);
    }).catch((err) => {
        console.log('Get song by ID request failed');
        res.send(err);
    });
});

app.get('/songs/:songId/file', (req, res) => {
    manager.getSongById(Number(req.params.songId)).then((song) => {
        res.sendFile(song.filePath);
    }).catch((err) => {
        console.log('Get song file by ID request failed');
        res.send(err);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});