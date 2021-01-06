const dataAccess = require('../data-access');
const dataObject = require('../data-object');
const mm = require('music-metadata');

const getAlbumFromMetadata = (metadata) => {
    return new Promise((resolve, reject) => {
        dataAccess.getAlbumByTitle(metadata.common.album).then((album) => {
            if (album == undefined) {
                album = new dataObject.Album().fromMetadata(metadata);
                dataAccess.addAlbum(album).then(() => {
                    dataAccess.getAlbumByTitle(metadata.common.album).then((album) => {
                        resolve(album);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(album);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

const addSongFromPath = (path) => {
    return new Promise((resolve, reject) => {
        mm.parseFile(path).then((metadata) => {
            getAlbumFromMetadata(metadata).then((album) => {
                const song = new dataObject.Song(path).fromMetadata(metadata);
                song.albumId = album.id;
                dataAccess.addSong(song).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};


const getAllSongs = () => {
    return dataAccess.getAllSongs();
};

/**
 * @see {@link dataAccess.getAllAlbums}
 */
const getAllAlbums = () => {
    return dataAccess.getAllAlbums();
}

module.exports.addSongFromPath = addSongFromPath;
module.exports.getAllSongs = getAllSongs;
module.exports.getAllAlbums = getAllAlbums;