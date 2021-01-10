const dataObject = require('../data-object');
const ServerError = require('../util').ServerError;

let db = undefined;

const insertBlankArtist = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ARTISTS (artist_id, name)
        values (0, '')`, (err) => {
            if (err) {
                reject(new ServerError('Failed to insert blank artist', err));
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
            name TEXT,
            unique(name)
            );`, (err) => {
                if (err) {
                    reject(new ServerError('Failed to create artist table', err));
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

const addArtist = (artist) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ARTISTS (name)
        values ($name);`, artist.toDB(), (err) => {
            if (err) {
                if (err.errno == 19 && err.message.includes('UNIQUE constraint failed')) {
                    resolve();
                } else {
                    reject(new ServerError(`Failed to add artist '${artist.name}'`, err));
                }
            } else {
                console.log(`Added artist '${artist.name}'`);
                resolve();
            }
        });
    });
};

const getAllArtists = () => {
    return new Promise((resolve, reject) => {
        db.all(`select * from ARTISTS
        where artist_id > 0;`, (err, rows) => {
            if (err) {
                reject(new ServerError('Failed to get all artists', err));
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

const getArtistByName = (artistName) => {
    return new Promise((resolve, reject) => {
        artistName = artistName == undefined ? '' : artistName.trim();
        db.get(`select * from ARTISTS
            where name = $artistName;`, {
                $artistName: artistName
            }, (err, row) => {
                if (err) {
                    reject(new ServerError(`Failed to get artist by name '${artistName}'`, err));
                } else {
                    console.log(`Got the artist by name '${artistName}'`);
                    if (row == undefined) {
                        console.log(`(Artist '${artistName}' doesn't exist yet)`)
                    }
                    resolve(row == undefined ? undefined : new dataObject.Artist().fromDB(row));
                }
            });
    });
};

const getArtistById = (artistId) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from ARTISTS
            where artist_id = $artistId;`, {
                $artistId: artistId
            }, (err, row) => {
                if (err) {
                    reject(new ServerError(`Failed to get artist by ID ${artistId}`, err));
                } else {
                    console.log('Got the artist by ID');
                    resolve(row == undefined ? undefined : new dataObject.Artist().fromDB(row));
                }
            });
    });
};

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        createArtistTable().then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError('Failed to initialize artists', err));
        });
    });
};

module.exports.addArtist = addArtist;
module.exports.getAllArtists = getAllArtists;
module.exports.getArtistByName = getArtistByName;
module.exports.getArtistById = getArtistById;
module.exports.init = init;