const dataObject = require('../data-object');
const ServerError = require('../util').ServerError;

let db = undefined;

const insertBlankAlbum = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ALBUMS (album_id, title, artist, year, genre)
        values (0, '', '', 0, '')`, (err) => {
            if (err) {
                reject(new ServerError('Failed to insert blank album', err));
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
                    reject(new ServerError('Failed to create album table', err));
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

const addAlbum = (album) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ALBUMS (title, artist, year, genre)
        values ($title, $artist, $year, $genre);`, album.toDB(), (err) => {
            if (err) {
                reject(new ServerError(`Failed to add album '${album.title}'`, err));
            } else {
                console.log(`Added album '${album.title}'`);
                resolve();
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
                reject(new ServerError('Failed to get all albums', err));
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

const getAlbumByTitle = (title) => {
    return new Promise((resolve, reject) => {
        title = title == undefined ? '' : title.trim();
        db.get(`select * from ALBUMS
            where title = $title;`, {
                $title: title
            }, (err, row) => {
                if (err) {
                    reject(new ServerError(`Failed to get album by title '${title}'`, err));
                } else {
                    console.log(`Got the album by title '${title}'`);
                    if (row == undefined) {
                        console.log(`(Album '${title}' doesn't exist yet)`)
                    }
                    resolve(row == undefined ? undefined : new dataObject.Album().fromDB(row));
                }
            });
    });
};

const getAlbumsByArtistId = (id) => {
    return new Promise((resolve, reject) => {
        db.all(`select distinct a.*
        from ALBUMS a,
        SONGS s
        where s.artist_id = $artistId
        and a.album_id = s.album_id
        and s.song_id > 0;`, {
            $artistId: id
        }, (err, rows) => {
            if (err) {
                reject(new Server(`Failed to get albums by artist ID ${id}`, err));
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

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        createAlbumTable().then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError('Failed to initialize albums', err));
        })
    });
};

module.exports.addAlbum = addAlbum;
module.exports.getAlbumByTitle = getAlbumByTitle;
module.exports.getAllAlbums = getAllAlbums;
module.exports.getAlbumsByArtistId = getAlbumsByArtistId;
module.exports.init = init;