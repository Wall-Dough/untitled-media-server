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
            song_id int,
            file_path varchar(255),
            title varchar(255),
            artist varchar(255),
            album_id int,
            disc int,
            track int,
            year int,
            genre varchar(255));`, (err) => {
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
            album_id int,
            title varchar(255),
            artist varchar(255),
            year int,
            genre varchar(255)
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
        album.id = ++idSeq;
        db.run(`insert into ALBUMS (album_id, title, artist, year, genre)
        values (${album.id}, '${album.title}', '${album.artist}', ${album.year}, '${album.genre}');`, (err) => {
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
        song.id = ++idSeq;
        db.run(`insert into SONGS (song_id, file_path, title, artist, album_id, disc, track, year, genre)
        values (${song.id}, '${song.filePath}', '${song.title}', '${song.artist}', ${song.albumId}, 
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
        db.all(`select s.song_id, s.file_path, s.title, s.artist, 
        s.album_id, s.disc, s.track, s.year, s.genre, 
        a.title as album
        from SONGS s,
        ALBUMS a
        where a.album_id = s.album_id
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
module.exports.getAlbumByTitle = getAlbumByTitle;
module.exports.addAlbum = addAlbum;

init();