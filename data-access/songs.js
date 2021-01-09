const dataObject = require('../data-object');

let db = undefined;

const SONG_SELECT_PART = `select s.song_id, s.file_path, s.title, s.artist_id, 
s.album_id, s.disc, s.track, s.year, s.genre, 
a.title as album, art.name as artist
from SONGS s,
ALBUMS a,
ARTISTS art`;
const SONG_SELECT = `${SONG_SELECT_PART}
where a.album_id = s.album_id
and art.artist_id = s.artist_id`;

const insertBlankSong = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into SONGS (song_id, file_path, title, artist_id, album_id, disc, track, year, genre)
        values (0, '', '', 0, 0, 0, 0, 0, '')`, (err) => {
            if (err) {
                console.log('Insert blank song failed');
                reject(err);
            } else {
                console.log('Inserted blank song');
                resolve();
            }
        })
    });
};

const createSongTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table SONGS (
            song_id INTEGER PRIMARY KEY,
            file_path TEXT,
            title TEXT,
            artist_id INTEGER,
            album_id INTEGER,
            disc INTEGER,
            track INTEGER,
            year INTEGER,
            genre TEXT);`, (err) => {
                if (err) {
                    console.log('Create song failed');
                    reject(err);
                } else {
                    console.log('Created song table');
                    insertBlankSong().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    })
};

const addSong = (song) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into SONGS (file_path, title, artist_id, album_id, disc, track, year, genre)
        values ($filePath, $title, $artistId, $albumId, $discNumber, $trackNumber, $year, $genre);`,
        song.toDB(), (err) => {
            if (err) {
                console.log('Add song failed');
                reject(err);
            } else {
                console.log('Added song');
                resolve();
            }
        });
    });
};

const getAllSongs = () => {
    return new Promise((resolve, reject) => {
        db.all(`${SONG_SELECT}
        and s.song_id > 0;`, (err, rows) => {
            if (err) {
                console.log('Get all songs failed');
                reject(err);
            } else {
                console.log('Got all songs');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Song().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

/**
 * @function getSongById
 * @memberof dataAccess
 * 
 * @param {number} id the song ID to query for
 * @returns a Promise that resolves with the song
 */
const getSongById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`${SONG_SELECT}
        and s.song_id = $songId;`, {
            $songId: id
        }, (err, row) => {
            if (err) {
                console.log('Get song by id failed');
                reject(err);
            } else {
                console.log('Got song by id');
                resolve(new dataObject.Song().fromDB(row));
            }
        });
    });
};

const getSongByPath = (path) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from SONGS where file_path = $path;`, {
            $path: path
        }, (err, row) => {
            if (err) {
                console.log('Get song by path failed');
                reject(err);
            } else {
                console.log('Got song by path');
                resolve(row);
            }
        });
    });
};

/**
 * @function getSongsByAlbumId
 * @memberof dataAccess
 * 
 * Gets all songs in an album
 * @param {number} id the album ID to retrieve the songs for
 * @returns a Promise that resolves with an array of the songs in the album
 */
const getSongsByAlbumId = (id) => {
    return new Promise((resolve, reject) => {
        db.all(`${SONG_SELECT}
        and s.album_id = $albumId
        and s.song_id > 0;`, {
            $albumId: id
        }, (err, rows) => {
            if (err) {
                console.log('Get songs by album id failed');
                reject(err);
            } else {
                console.log('Got songs by album id');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Song().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

const getSongsByArtistId = (id) => {
    return new Promise((resolve, reject) => {
        db.all(`${SONG_SELECT}
        and s.artist_id = $artistId
        and s.song_id > 0;`, {
            $artistId: id
        }, (err, rows) => {
            if (err) {
                console.log('Get songs by artist id failed');
                reject(err);
            } else {
                console.log('Got songs by artist id');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Song().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

const getSongsByGroupId = (groupId) => {
    return new Promise((resolve, reject) => {
        db.all(`${SONG_SELECT_PART},
        GROUPS_SONGS gs
        where gs.group_id = $groupId
        and s.song_id = gs.song_id
        and s.album_id = a.album_id
        and s.song_id > 0;`, {
            $groupId: groupId
        }, (err, rows) => {
            if (err) {
                console.log('Get songs by group id failed');
                reject(err);
            } else {
                console.log('Got songs by group id');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Song().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

/**
 * @function getSongsByPlaylistId
 * @memberof dataAccess
 * 
 * Gets all the songs in the playlist
 * @param {number} id the ID of the playlist to retrieve songs for
 * @returns a Promise that resolves with an array of the songs in the playlist
 */
const getSongsByPlaylistId = (playlistId) => {
    return getSongsByGroupId(playlistId);
};

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        createSongTable().then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.addSong = addSong;
module.exports.getAllSongs = getAllSongs;
module.exports.getSongById = getSongById;
module.exports.getSongByPath = getSongByPath;
module.exports.getSongsByAlbumId = getSongsByAlbumId;
module.exports.getSongsByArtistId = getSongsByArtistId;
module.exports.getSongsByGroupId = getSongsByGroupId;
module.exports.getSongsByPlaylistId = getSongsByPlaylistId;
module.exports.init = init;