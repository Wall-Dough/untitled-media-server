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
 * @function getSongsByAlbumId
 * @memberof manager
 * 
 * Gets all songs in an album
 * @param {number} id the album ID to retrieve the songs for
 * @returns a Promise that resolves with an array of the songs in the album
 */
const getSongsByAlbumId = (id) => {
    return dataAccess.getSongsByAlbumId(id);
};

/**
 * @see {@link dataAccess.getAllAlbums}
 */
const getAllAlbums = () => {
    return dataAccess.getAllAlbums();
}

/**
 * @function addPlaylist
 * @memberof manager
 * 
 * Adds a new empty playlist to the database
 * @param {string} playlistName the name of the playlist to add
 * @returns a Promise that resolves when the playlist has been added
 */
const addPlaylist = (playlistName) => {
    return dataAccess.addPlaylist(playlistName);
};

/**
 * @function getAllPlaylists
 * @memberof manager
 * 
 * Gets all the playlists in the database
 * @returns a Promise that resolves with an array of all playlists
 */
const getAllPlaylists = () => {
    return dataAccess.getAllPlaylists();
};

/**
 * @function addSongToPlaylist
 * @memberof manager
 * 
 * Adds the song to the playlist
 * @param {number} playlistId the ID of the playlist to add the song to
 * @param {number} songId the ID of the song to add to the playlist
 * @returns a Promise that resolves when the song has been added to the playlist
 */
const addSongToPlaylist = (playlistId, songId) => {
    return dataAccess.addSongToPlaylist(playlistId, songId);
}

/**
 * @function getSongsByPlaylistId
 * @memberof manager
 * 
 * Gets all the songs in the playlist
 * @param {number} id the ID of the playlist to retrieve songs for
 * @returns a Promise that resolves with an array of the songs in the playlist
 */
const getSongsByPlaylistId = (id) => {
    return dataAccess.getSongsByPlaylistId(id);
};


module.exports.addSongFromPath = addSongFromPath;
module.exports.getAllSongs = getAllSongs;
module.exports.getSongById = getSongById;
module.exports.getSongsByAlbumId = getSongsByAlbumId;
module.exports.getAllAlbums = getAllAlbums;
module.exports.addPlaylist = addPlaylist;
module.exports.getAllPlaylists = getAllPlaylists;
module.exports.addSongToPlaylist = addSongToPlaylist;
module.exports.getSongsByPlaylistId = getSongsByPlaylistId;