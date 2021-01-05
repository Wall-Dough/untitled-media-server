const dataAccess = require('../data-access');
const dataObject = require('../data-object');
const mm = require('music-metadata');

const addSongFromPath = (path) => {
    return new Promise((resolve, reject) => {
        mm.parseFile(path).then((metadata) => {
            const song = new dataObject.Song(path).fromMetadata(metadata);
            dataAccess.addSong(song).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    });
};

const getAllSongs = () => {
    return dataAccess.getAllSongs();
};

module.exports.addSongFromPath = addSongFromPath;
module.exports.getAllSongs = getAllSongs;