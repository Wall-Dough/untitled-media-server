/**
 * @namespace dataAccess
 */

const sqlite3 = require('sqlite3');
const dataObject = require('../data-object');

const db = new sqlite3.Database(':memory:');

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

const insertBlankArtist = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ARTISTS (artist_id, name)
        values (0, '')`, (err) => {
            if (err) {
                console.log('Insert blank artist failed');
                reject(err);
            } else {
                console.log('Inserted blank artist');
                resolve();
            }
        })
    });
};

const createArtistTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table ARTISTS (
            artist_id INTEGER PRIMARY KEY,
            name TEXT
            );`, (err) => {
                if (err) {
                    console.log('Create artist table failed');
                    reject(err);
                } else {
                    console.log('Created artist table');
                    insertBlankArtist().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const insertBlankGroup = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS (group_id, name, type_cd)
        values (0, '', 0)`, (err) => {
            if (err) {
                console.log('Insert blank group failed');
                reject(err);
            } else {
                console.log('Inserted blank group');
                resolve();
            }
        })
    });
};

const createGroupsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table GROUPS (
            group_id INTEGER PRIMARY KEY,
            name TEXT,
            type_cd INTEGER
            );`, (err) => {
                if (err) {
                    console.log('Create groups table failed');
                    reject(err);
                } else {
                    console.log('Created groups table');
                    insertBlankGroup().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const insertBlankGroupsSongsRow = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS_SONGS (group_id, song_id)
        values (0, 0)`, (err) => {
            if (err) {
                console.log('Insert blank groups songs row failed');
                reject(err);
            } else {
                console.log('Inserted blank groups songs row');
                resolve();
            }
        })
    });
};

const createGroupsSongsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table GROUPS_SONGS (
            group_id INTEGER,
            song_id INTEGER
            );`, (err) => {
                if (err) {
                    console.log('Create groups and songs table failed');
                    reject(err);
                } else {
                    console.log('Created groups and songs table');
                    insertBlankGroupsSongsRow().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const addGroup = (groupName, typeCode) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS (name, type_cd)
        values ('${groupName}', ${typeCode});`, (err) => {
            if (err) {
                console.log('Add group failed');
                reject(err);
            } else {
                console.log('Added group');
                resolve();
            }
        });
    });
};

const PLAYLIST_TYPE_CD = 1;

/**
 * @function addPlaylist
 * @memberof dataAccess
 * 
 * Adds a new empty playlist to the database
 * @param {string} playlistName the name of the playlist to add
 * @returns a Promise that resolves when the playlist has been added
 */
const addPlaylist = (playlistName) => {
    return addGroup(playlistName, PLAYLIST_TYPE_CD);
};

const getAllGroupsByTypeCd = (typeCd) => {
    return new Promise((resolve, reject) => {
        db.all(`select *
        from GROUPS
        where type_cd = ${typeCd};`, (err, rows) => {
            if (err) {
                console.log('Get groups by type cd failed');
                reject(err);
            } else {
                console.log('Got groups by type cd');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Group().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

/**
 * @function getAllPlaylists
 * @memberof dataAccess
 * 
 * Gets all the playlists in the database
 * @returns a Promise that resolves with an array of all playlists
 */
const getAllPlaylists = () => {
    return new Promise((resolve, reject) => {
        getAllGroupsByTypeCd(PLAYLIST_TYPE_CD).then((groups) => {
            const playlists = groups.map((group) => {
                return new dataObject.Playlist().fromGroup(group);
            });
            resolve(playlists);
        }).catch((err) => {
            reject(err);
        });
    });
};

const getSongsByGroupId = (groupId) => {
    return new Promise((resolve, reject) => {
        db.all(`${SONG_SELECT_PART},
        GROUPS_SONGS gs
        where gs.group_id = ${groupId}
        and s.song_id = gs.song_id
        and s.album_id = a.album_id
        and s.song_id > 0;`, (err, rows) => {
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

const addSongToGroup = (groupId, songId) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS_SONGS (group_id, song_id)
        values (${groupId}, ${songId});`, (err) => {
            if (err) {
                console.log('Add song to group failed');
                reject(err);
            } else {
                console.log('Added song to group');
                resolve();
            }
        });
    });
};

/**
 * @function addSongToPlaylist
 * @memberof dataAccess
 * 
 * Adds the song to the playlist
 * @param {number} playlistId the ID of the playlist to add the song to
 * @param {number} songId the ID of the song to add to the playlist
 * @returns a Promise that resolves when the song has been added to the playlist
 */
const addSongToPlaylist = (playlistId, songId) => {
    return addSongToGroup(playlistId, songId);
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

const getArtistByName = (artistName) => {
    return new Promise((resolve, reject) => {
        artistName = artistName == undefined ? '' : artistName.trim();
        db.get(`select * from ARTISTS
            where name = '${artistName}';`, (err, row) => {
                if (err) {
                    console.log('Get artist by name failed');
                    reject(err);
                } else {
                    console.log('Got the artist by name');
                    resolve(row == undefined ? undefined : new dataObject.Artist().fromDB(row));
                }
            });
    });
};

const getArtistById = (artistId) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from ARTISTS
            where artist_id = ${artistId};`, (err, row) => {
                if (err) {
                    console.log('Get artist by ID failed');
                    reject(err);
                } else {
                    console.log('Got the artist by ID');
                    resolve(row == undefined ? undefined : new dataObject.Artist().fromDB(row));
                }
            });
    });
};

const addArtist = (artist) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ARTISTS (name)
        values ('${artist.name}');`, (err) => {
            if (err) {
                console.log('Add artist failed');
                reject(err);
            } else {
                console.log('Added artist');
                resolve();
            }
        });
    });
};

const addSong = (song) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into SONGS (file_path, title, artist_id, album_id, disc, track, year, genre)
        values ('${song.filePath}', '${song.title}', '${song.artistId}', ${song.albumId}, 
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

const getSongByPath = (path) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from SONGS where file_path = '${path}';`, (err, row) => {
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
        and s.album_id = ${id}
        and s.song_id > 0;`, (err, rows) => {
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
        and s.artist_id = ${id}
        and s.song_id > 0;`, (err, rows) => {
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

const getAllArtists = () => {
    return new Promise((resolve, reject) => {
        db.all(`select * from ARTISTS
        where artist_id > 0;`, (err, rows) => {
            if (err) {
                console.log('Get all artists failed');
                reject(err);
            } else {
                console.log('Got all artists');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Artist().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

const getAlbumsByArtistId = (id) => {
    return new Promise((resolve, reject) => {
        db.all(`select distinct a.*
        from ALBUMS a,
        SONGS s
        where s.artist_id = ${id}
        and a.album_id = s.album_id
        and s.song_id > 0;`, (err, rows) => {
            if (err) {
                console.log('Get albums by artist failed');
                reject(err);
            } else {
                console.log('Got albums by artist');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Album().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

const init = () => {
    const promises = [];
    promises.push(createSongTable());
    promises.push(createAlbumTable());
    promises.push(createGroupsTable());
    promises.push(createGroupsSongsTable());
    promises.push(createArtistTable());

    return Promise.allSettled(promises);
};

module.exports.addSong = addSong;
module.exports.getAllSongs = getAllSongs;
module.exports.getSongById = getSongById;
module.exports.getSongByPath = getSongByPath;
module.exports.getSongsByAlbumId = getSongsByAlbumId;
module.exports.getAlbumByTitle = getAlbumByTitle;
module.exports.addAlbum = addAlbum;
module.exports.getAllAlbums = getAllAlbums;
module.exports.addPlaylist = addPlaylist;
module.exports.getAllPlaylists = getAllPlaylists;
module.exports.addSongToPlaylist = addSongToPlaylist;
module.exports.getSongsByPlaylistId = getSongsByPlaylistId;
module.exports.getArtistByName = getArtistByName;
module.exports.getArtistById = getArtistById;
module.exports.addArtist = addArtist;
module.exports.getSongsByArtistId = getSongsByArtistId;
module.exports.getAlbumsByArtistId = getAlbumsByArtistId;
module.exports.getAllArtists = getAllArtists;
module.exports.init = init;