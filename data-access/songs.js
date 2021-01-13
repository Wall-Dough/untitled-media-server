const dataObject = require('../data-object');
const ServerError = require('../util').ServerError;

let db = undefined;

const SONG_SELECT = `select s.song_id, s.file_path, s.title, s.artist_id, 
s.album_id, s.disc, s.track, s.year, s.genre, s.starred,
a.title as album, art.name as artist`;
const SONG_FROM = `from SONGS s,
ALBUMS a,
ARTISTS art`;
const SONG_WHERE = `where a.album_id = s.album_id
and art.artist_id = s.artist_id
and s.song_id > 0`;

const insertBlankSong = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into SONGS (song_id, file_path, title, artist_id, album_id, disc, track, year, genre, starred)
        values (0, '', '', 0, 0, 0, 0, 0, '', 0)`, (err) => {
            if (err) {
                reject(new ServerError('Failed to insert blank song', err));
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
            starred INTEGER,
            genre TEXT);`, (err) => {
                if (err) {
                    reject(new ServerError('Failed to create song table', err));
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
        db.run(`insert into SONGS (file_path, title, artist_id, album_id, disc, track, year, genre, starred)
        values ($filePath, $title, $artistId, $albumId, $discNumber, $trackNumber, $year, $genre, $starred);`,
        song.toDB(), (err) => {
            if (err) {
                reject(new ServerError(`Failed to add song '${song.title}'`, err));
            } else {
                console.log(`Added song '${song.title}'`);
                resolve();
            }
        });
    });
};

const getSongsByFilter = (filter) => {
    return new Promise((resolve, reject) => {
        let select = SONG_SELECT;
        let from = SONG_FROM;
        let where = SONG_WHERE;
        if (filter.starred != undefined) {
            where += `
            and s.starred = $starred`;
        }
        if (filter.playlistId > 0) {
            from += `,
            GROUPS_SONGS gs`;
            where += `
            and gs.song_id = s.song_id
            and gs.group_id = $playlistId`;
        }
        if (filter.artistId > 0) {
            where += `
            and s.artist_id = $artistId`
        }
        if (filter.albumId > 0) {
            where += `
            and s.album_id = $albumId`;
        }
        db.all(`${select}
        ${from}
        ${where};`, filter.toDB(), (err, rows) => {
            if (err) {
                reject(new ServerError('Failed to get songs from the filter', err));
            } else {
                console.log('Got songs from the filter');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Song().fromDB(row));
                }
                resolve(results);
            }
        })
    });
};

const getAllSongs = () => {
    return new Promise((resolve, reject) => {
        getSongsByFilter(new dataObject.Filter()).then((songs) => {
            resolve(songs);
        }).catch((err) => {
            reject(new ServerError(`Failed to get all songs`, err));
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
        ${SONG_FROM}
        ${SONG_WHERE}
        and s.song_id = $songId;`, {
            $songId: id
        }, (err, row) => {
            if (err) {
                reject(new ServerError(`Failed to get song with ID ${id}`, err));
            } else {
                console.log(`Got song with ID ${id}`);
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
                reject(new ServerError(`Failed to get song by path '${path}'`, err));
            } else {
                console.log(`Got song by path '${path}'`);
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
        getSongsByFilter(new dataObject.Filter().withAlbumId(id)).then((songs) => {
            resolve(songs);
        }).catch((err) => {
            reject(new ServerError(`Failed to get songs by album ID ${id}`, err));
        });
    });
};

const getSongsByArtistId = (id) => {
    return new Promise((resolve, reject) => {
        getSongsByFilter(new dataObject.Filter().withArtistId(id)).then((songs) => {
            resolve(songs);
        }).catch((err) => {
            reject(new ServerError(`Failed to get songs by artist ID ${id}`, err));
        });
    });
};

const getSongsByGroupId = (groupId) => {
    return new Promise((resolve, reject) => {
        db.all(`${SONG_SELECT}
        ${SONG_FROM},
        GROUPS_SONGS gs
        ${SONG_WHERE}
        and gs.group_id = $groupId
        and s.song_id = gs.song_id
        and s.song_id > 0;`, {
            $groupId: groupId
        }, (err, rows) => {
            if (err) {
                reject(new ServerError(`Failed to get songs by group ID ${groupId}`, err));
            } else {
                console.log(`Got songs by group ID ${groupId}`);
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
    return new Promise((resolve, reject) => {
        getSongsByGroupId(playlistId).then((songs) => {
            resolve(songs);
        }).catch((err) => {
            reject(new ServerError(`Failed to get songs by playlist ID ${playlistId}`, err));
        });
    });
};

const getAllStarredSongs = () => {
    return new Promise((resolve, reject) => {
        getSongsByFilter(new dataObject.Filter().withStarred(true)).then((songs) => {
            resolve(songs);
        }).catch((err) => {
            reject(new ServerError(`Failed to get all starred songs`, err));
        });
    });
};

const setStarredForSongId = (id, starred) => {
    return new Promise((resolve, reject) => {
        if (id <= 0) {
            reject(new ServerError(`Cannot set starred to ${starred} for invalid song ID ${id}`));
        }
        if (starred == undefined) {
            reject(new ServerError(`Invalid starred value ${starred} for song ID ${id}`));
        }
        db.run(`update SONGS
        set starred = $starred
        where song_id = $songId;`, {
            $starred: starred,
            $songId: id 
        }, (err) => {
            if (err) {
                reject(new ServerError(`Failed to set starred to ${starred} for song ID ${id}`, err));
            } else {
                console.log(`Set starred to ${starred} for song ID ${id}`);
                resolve();
            }
        });
    });
};


const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        createSongTable().then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError(`Failed to initialize songs`, err));
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
module.exports.getAllStarredSongs = getAllStarredSongs;
module.exports.setStarredForSongId = setStarredForSongId;
module.exports.getSongsByFilter = getSongsByFilter;
module.exports.init = init;