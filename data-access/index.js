const sqlite3 = require('sqlite3');
const dataObject = require('../data-object');

const db = new sqlite3.Database(':memory:');
let idSeq = 0;

const createSongTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table SONGS (
            song_id int,
            file_path varchar(255),
            title varchar(255),
            artist varchar(255),
            album varchar(255),
            album_artist varchar(255),
            disc int,
            track int,
            year int,
            genre varchar(255));`, (err) => {
                if (err) {
                    console.log('Create song failed');
                    reject(err);
                } else {
                    console.log('Created song table');
                    resolve();
                }
            });
    })
};

const createAlbumTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table ALBUMS (
            album_id int,
            title varchar(255),
            arist varchar(255),
            year int,
            genre varchar(255)
            );`, (err) => {
                if (err) {
                    console.log('Create album failed');
                    reject(err);
                } else {
                    console.log('Created album table');
                    resolve();
                }
            });
    });
};

const addSong = (song) => {
    return new Promise((resolve, reject) => {
        song.id = ++idSeq;
        db.run(`insert into SONGS (song_id, file_path, title, artist, album, album_artist, disc, track, year, genre)
        values (${song.id}, '${song.filePath}', '${song.title}', '${song.artist}', '${song.album}', '${song.albumArtist}', 
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
        db.all('select * from SONGS;', (err, rows) => {
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

init();