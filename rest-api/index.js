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

const sendPlaylist = (req, res, songs) => {
    console.log(songs);
    const songIds = songs.map((song) => {
        return song.id;
    });
    const playlist = util.createPLS(`${req.hostname}:${port}`, songIds);
    res.type(PLS_MIME_TYPE);
    res.send(playlist);
};

app.get('/', (req, res) => {
    webInterface.getHomepage().then((homepage) => {
        res.send(homepage);
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/artists', (req, res) => {
    manager.getAllArtists().then((artists) => {
        res.send(artists);
    }).catch((err) => {
        console.log('Get all artists request failed');
        res.send(err);
    });
});

app.get('/artists/:artistId', (req, res) => {
    manager.getArtistById(Number(req.params.artistId)).then((artist) => {
        res.send(artist);
    }).catch((err) => {
        console.log('Get artist by ID request failed');
        res.send(err);
    });
});

app.get('/artists/:artistId/songs', (req, res) => {
    manager.getSongsByArtistId(Number(req.params.artistId)).then((songs) => {
        res.send(songs);
    }).catch((err) => {
        console.log('Get songs by artist ID request failed');
        res.send(err);
    });
});

app.get('/artists/:artistId/songs/stream', (req, res) => {
    manager.getSongsByArtistId(Number(req.params.artistId)).then((songs) => {
        sendPlaylist(req, res, songs);
    }).catch((err) => {
        console.log('Get songs by artist ID request failed');
        res.send(err);
    });
});

app.get('/artists/:artistId/albums', (req, res) => {
    manager.getAlbumsByArtistId(Number(req.params.artistId)).then((albums) => {
        res.send(albums);
    }).catch((err) => {
        console.log('Get albums by artist ID request failed');
        res.send(err);
    });
});

app.get('/albums', (req, res) => {
    manager.getAllAlbums().then((albums) => {
        res.send(albums);
    }).catch((err) => {
        console.log('Get all albums request failed');
        res.send(err);
    });
});

app.get('/albums/:albumId', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        res.send(songs);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.send(err);
    });
});

app.get('/albums/:albumId/songs', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        res.send(songs);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.send(err);
    });
});

app.get('/albums/:albumId/stream', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        sendPlaylist(req, res, songs);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.send(err);
    });
});

app.get('/playlists', (req, res) => {
    manager.getAllPlaylists().then((playlists) => {
        res.send(playlists);
    }).catch((err) => {
        console.log('Get all playlists request failed');
        res.send(err);
    });
});

app.put('/playlists', (req, res) => {
    manager.addPlaylist(req.query.name).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Add playlist request failed');
        res.send(err);
    });;
});

app.get('/playlists/:playlistId', (req, res) => {
    manager.getSongsByPlaylistId(Number(req.params.playlistId)).then((songs) => {
        res.send(songs);
    }).catch((err) => {
        console.log('Get playlist by ID request failed');
        res.send(err);
    });
});

app.get('/playlists/:playlistId/songs', (req, res) => {
    manager.getSongsByPlaylistId(Number(req.params.playlistId)).then((songs) => {
        res.send(songs);
    }).catch((err) => {
        console.log('Get playlist by ID request failed');
        res.send(err);
    });
});

app.put('/playlists/:playlistId/songs/:songId', (req, res) => {
    manager.addSongToPlaylist(Number(req.params.playlistId), Number(req.params.songId)).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Add song to playlist request failed');
        res.send(err);
    });
});

app.get('/playlists/:playlistId/stream', (req, res) => {
    manager.getSongsByPlaylistId(Number(req.params.playlistId)).then((songs) => {
        sendPlaylist(req, res, songs);
    }).catch((err) => {
        console.log('Get playlist by ID request failed');
        res.send(err);
    });
});

app.get('/songs/', (req, res) => {
    manager.getAllSongs().then((songs) => {
        res.send(songs);
    }).catch((err) => {
        console.log('Get all songs request failed');
        res.send(err);
    });
});

app.get('/songs/:songId', (req, res) => {
    manager.getSongById(Number(req.params.songId)).then((song) => {
        res.send(song);
    }).catch((err) => {
        console.log('Get song by ID request failed');
        res.send(err);
    });
});

app.get('/songs/:songId/stream', (req, res) => {
    manager.getSongById(Number(req.params.songId)).then((song) => {
        sendPlaylist(req, res, [song]);
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

app.post('/folders', (req, res) => {
    manager.scanFoldersForMediaFiles().then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Scan folders for media files request failed');
        res.send(err);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});