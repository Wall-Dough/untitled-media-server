/**
 * @namespace dataAccess
 */

const sqlite3 = require('sqlite3');
const dataObject = require('../data-object');

const db = new sqlite3.Database(':memory:');
let idSeq = 0;

const insertBlankSong = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into SONGS (song_id, file_path, title, artist, album_id, disc, track, year, genre)
        values (0, '', '', '', 0, 0, 0, 0, '')`, (err) => {
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
            artist TEXT,
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

const insertBlankAlbum = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ALBUMS (album_id, title, artist, year, genre)
        values (0, '', '', 0, '')`, (err) => {
            if (err) {
                console.log('Insert blank album failed');
                reject(err);
            } else {
                console.log('Inserted blank album');
                resolve();
            }
        })
    });
};

const createAlbumTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table ALBUMS (
            album_id INTEGER PRIMARY KEY,
            title TEXT,
            artist TEXT,
            year INTEGER,
            genre TEXT
            );`, (err) => {
                if (err) {
                    console.log('Create album failed');
                    reject(err);
                } else {
                    console.log('Created album table');
                    insertBlankAlbum().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const getAlbumByTitle = (title) => {
    return new Promise((resolve, reject) => {
        title = title == undefined ? '' : title.trim();
        db.get(`select * from ALBUMS
            where title = '${title}';`, (err, row) => {
                if (err) {
                    console.log('Get album by title failed');
                    reject(err);
                } else {
                    console.log('Got the album by title');
                    resolve(row == undefined ? undefined : new dataObject.Album().fromDB(row));
                }
            });
    });
};

const addAlbum = (album) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ALBUMS (title, artist, year, genre)
        values ('${album.title}', '${album.artist}', ${album.year}, '${album.genre}');`, (err) => {
            if (err) {
                console.log('Add album failed');
                reject(err);
            } else {
                console.log('Added album');
                resolve();
            }
        });
    });
};

const addSong = (song) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into SONGS (file_path, title, artist, album_id, disc, track, year, genre)
        values ('${song.filePath}', '${song.title}', '${song.artist}', ${song.albumId}, 
        ${song.discNumber}, ${song.trackNumber}, ${song.year}, '${song.genre}');`, (err) => {
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

const SONG_SELECT = `select s.song_id, s.file_path, s.title, s.artist, 
s.album_id, s.disc, s.track, s.year, s.genre, 
a.title as album
from SONGS s,
ALBUMS a
where a.album_id = s.album_id`;

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
        and s.song_id = ${id};`, (err, row) => {
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
        and s.album_id = ${id};`, (err, rows) => {
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

/**
 * @function getAllAlbums
 * @memberof dataAccess
 *
 * Gets all albums
 * @returns a Promise that resolves with an array of Albums
 */
const getAllAlbums = () => {
    return new Promise((resolve, reject) => {
        db.all(`select * from ALBUMS;`, (err, rows) => {
            if (err) {
                console.log('Get all albums failed');
                reject(err);
            } else {
                console.log('Got all albums');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Album().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

const init = async () => {
    const promises = [];
    promises.push(createSongTable());
    promises.push(createAlbumTable());

    for (let promise of promises) {
        await promise;
    }
};

module.exports.addSong = addSong;
module.exports.getAllSongs = getAllSongs;
module.exports.getSongById = getSongById;
module.exports.getSongsByAlbumId = getSongsByAlbumId;
module.exports.getAlbumByTitle = getAlbumByTitle;
module.exports.addAlbum = addAlbum;
module.exports.getAllAlbums = getAllAlbums;

init();