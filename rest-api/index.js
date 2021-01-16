const express = require('express');
const fs = require('fs');
const util = require('../util');
const ServerError = util.ServerError;
const webInterface = require('../web-interface');
const manager = require('../manager');
const dataObject = require('../data-object');

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
    res.status(200).send(playlist);
};

app.get('/', (req, res) => {
    webInterface.getHomepage().then((homepage) => {
        res.status(200).send(homepage);
    }).catch((err) => {
        console.log(new util.ServerError())
        res.status(500).send(err.message);
    });
});

app.get('/artists', (req, res) => {
    manager.getAllArtists().then((artists) => {
        res.status(200).send(artists);
    }).catch((err) => {
        console.log('Get all artists request failed');
        res.status(500).send(err.message);
    });
});

app.get('/artists/:artistId', (req, res) => {
    manager.getArtistById(Number(req.params.artistId)).then((artist) => {
        res.status(200).send(artist);
    }).catch((err) => {
        console.log('Get artist by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/artists/:artistId/songs', (req, res) => {
    manager.getSongsByArtistId(Number(req.params.artistId)).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get songs by artist ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/artists/:artistId/songs/stream', (req, res) => {
    manager.getSongsByArtistId(Number(req.params.artistId)).then((songs) => {
        sendPlaylist(req, res, songs);
    }).catch((err) => {
        console.log('Get songs by artist ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/artists/:artistId/albums', (req, res) => {
    manager.getAlbumsByArtistId(Number(req.params.artistId)).then((albums) => {
        res.status(200).send(albums);
    }).catch((err) => {
        console.log('Get albums by artist ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/albums', (req, res) => {
    manager.getAllAlbums().then((albums) => {
        res.status(200).send(albums);
    }).catch((err) => {
        console.log('Get all albums request failed');
        res.status(500).send(err.message);
    });
});

app.get('/albums/starred', (req, res) => {
    manager.getAllStarredAlbums().then((albums) => {
        res.status(200).send(albums);
    }).catch((err) => {
        console.log('Get all starred albums request failed');
        console.log(err.message);
    });
});

app.put('/albums/starred/:albumId', (req, res) => {
    manager.setStarredForAlbumId(Number(req.params.albumId), true).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Star album request failed');
        console.log(err.message);
    });
});

app.delete('/albums/starred/:albumId', (req, res) => {
    manager.setStarredForAlbumId(Number(req.params.albumId), false).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Unstar album request failed');
        console.log(err.message);
    });
});

app.get('/albums/:albumId', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/albums/:albumId/songs', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/albums/:albumId/stream', (req, res) => {
    manager.getSongsByAlbumId(Number(req.params.albumId)).then((songs) => {
        sendPlaylist(req, res, songs);
    }).catch((err) => {
        console.log('Get album by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/playlists', (req, res) => {
    manager.getAllPlaylists().then((playlists) => {
        res.status(200).send(playlists);
    }).catch((err) => {
        console.log('Get all playlists request failed');
        res.status(500).send(err.message);
    });
});

app.put('/playlists', (req, res) => {
    manager.addPlaylist(req.query.name).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Add playlist request failed');
        res.status(500).send(err.message);
    });;
});

app.get('/playlists/:playlistId', (req, res) => {
    manager.getSongsByPlaylistId(Number(req.params.playlistId)).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get playlist by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/playlists/:playlistId/songs', (req, res) => {
    manager.getSongsByPlaylistId(Number(req.params.playlistId)).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get playlist by ID request failed');
        res.status(500).send(err.message);
    });
});

app.put('/playlists/:playlistId/songs/:songId', (req, res) => {
    manager.addSongToPlaylist(Number(req.params.playlistId), Number(req.params.songId)).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Add song to playlist request failed');
        res.status(500).send(err.message);
    });
});

app.get('/playlists/:playlistId/stream', (req, res) => {
    manager.getSongsByPlaylistId(Number(req.params.playlistId)).then((songs) => {
        sendPlaylist(req, res, songs);
    }).catch((err) => {
        console.log('Get playlist by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/songs', (req, res) => {
    let promise;
    if (req.query.tagIds) {
        const tagIds = req.query.tagIds.split(',').map(Number);
        promise = manager.getSongsByTagIds(tagIds);
    } else {
        promise = manager.getAllSongs();
    }
    promise.then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get all songs request failed');
        res.status(500).send(err.message);
    });
});

app.get('/songs/starred', (req, res) => {
    manager.getAllStarredSongs().then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get all starred songs request failed');
        res.status(500).send(err.message);
    });
});

app.put('/songs/starred/:songId', (req, res) => {
    manager.setStarredForSongId(Number(req.params.songId), true).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Star song request failed');
        res.status(500).send(err.message);
    });
});

app.delete('/songs/starred/:songId', (req, res) => {
    manager.setStarredForSongId(Number(req.params.songId), false).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Unstar song request failed');
        res.status(500).send(err.message);
    });
});

app.get('/songs/:songId', (req, res) => {
    manager.getSongById(Number(req.params.songId)).then((song) => {
        res.status(200).send(song);
    }).catch((err) => {
        console.log('Get song by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/songs/:songId/stream', (req, res) => {
    manager.getSongById(Number(req.params.songId)).then((song) => {
        sendPlaylist(req, res, [song]);
    }).catch((err) => {
        console.log('Get song by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/songs/:songId/file', (req, res) => {
    manager.getSongById(Number(req.params.songId)).then((song) => {
        res.status(200).sendFile(song.filePath);
    }).catch((err) => {
        console.log('Get song file by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/songs/:songId/tags', (req, res) => {
    manager.getTagsBySongId(Number(req.params.songId)).then((tags) => {
        res.status(200).send(tags);
    }).catch((err) => {
        console.log('Get tags by song ID request failed');
        res.status(500).send(err.message);
    });
})

app.put('/songs/:songId/tags/:tagId', (req, res) => {
    manager.addSongToTag(Number(req.params.tagId), Number(req.params.songId)).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Add song to tag request failed');
    })
});

app.delete('/songs/:songId/tags/:tagId', (req, res) => {
    res.status(404).send('Remove tag from song not yet implemented');
});

app.get('/tags', (req, res) => {
    manager.getAllTags().then((tags) => {
        res.status(200).send(tags);
    }).catch((err) => {
        console.log('Get all tags request failed');
        res.status(500).send(err.message);
    });
});

app.put('/tags', (req, res) => {
    manager.addTag(req.query.name).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Add tag request failed');
        res.status(500).send(err.message);
    });
});

app.get('/tags/:tagId', (req, res) => {
    manager.getSongsByTagIds([Number(req.params.tagId)]).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get tag by ID request failed');
        res.status(500).send(err.message);
    });
});

app.get('/tags/:tagId/songs', (req, res) => {
    manager.getSongsByTagIds([Number(req.params.tagId)]).then((songs) => {
        res.status(200).send(songs);
    }).catch((err) => {
        console.log('Get songs by tag ID request failed');
        res.status(500).send(err.message);
    });
})

app.post('/folders', (req, res) => {
    manager.scanFoldersForMediaFiles().then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        console.log('Scan folders for media files request failed');
        res.status(500).send(err.message);
    });
});

const serveFromFolder = (req, res, folder) => {
    fs.readFile(util.relativePath(`../web-interface/${folder}/${req.params.fileName}`), (err, data) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).type('text/javascript').send(data);
        }
    });
};

app.get('/js/:fileName', (req, res) => {
    serveFromFolder(req, res, "js");
});

app.get('/css/:fileName', (req, res) => {
    serveFromFolder(req, res, "css");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});