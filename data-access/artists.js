const dataObject = require('../data-object');

let db = undefined;

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

const addArtist = (artist) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into ARTISTS (name)
        values ($name);`, artist.toDB(), (err) => {
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

const getArtistByName = (artistName) => {
    return new Promise((resolve, reject) => {
        artistName = artistName == undefined ? '' : artistName.trim();
        db.get(`select * from ARTISTS
            where name = $artistName;`, {
                $artistName: artistName
            }, (err, row) => {
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
            where artist_id = $artistId;`, {
                $artistId: artistId
            }, (err, row) => {
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

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        createArtistTable().then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.addArtist = addArtist;
module.exports.getAllArtists = getAllArtists;
module.exports.getArtistByName = getArtistByName;
module.exports.getArtistById = getArtistById;
module.exports.init = init;