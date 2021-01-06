/**
 * @namespace manager
 */

const dataAccess = require('../data-access');
const dataObject = require('../data-object');
const util = require('../util');
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
 * @function getSongById
 * @memberof manager
 * 
 * Gets the song with the given song ID
 * @param {number} id the song ID to query for
 * @returns a Promise that resolves with the song
 */
const getSongById = (id) => {
    return dataAccess.getSongById(id);
};

/**
 * @see {@link dataAccess.getAllAlbums}
 */
const getAllAlbums = () => {
    return dataAccess.getAllAlbums();
}

module.exports.addSongFromPath = addSongFromPath;
module.exports.getAllSongs = getAllSongs;
module.exports.getSongById = getSongById;
module.exports.getAllAlbums = getAllAlbums;