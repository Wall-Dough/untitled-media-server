/**
 * @namespace manager
 */

const dataAccess = require('../data-access');
const dataObject = require('../data-object');
const util = require('../util');
const config = require('../config');
const mm = require('music-metadata');
const fs = require('fs');

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

const getArtistFromMetadata = (metadata) => {
    return new Promise((resolve, reject) => {
        dataAccess.getArtistByName(metadata.common.artist).then((artist) => {
            if (artist == undefined) {
                artist = new dataObject.Artist().fromMetadata(metadata);
                dataAccess.addArtist(artist).then(() => {
                    dataAccess.getArtistByName(metadata.common.artist).then((artist) => {
                        resolve(artist);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(artist);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

const addSongFromPath = (path) => {
    return new Promise((resolve, reject) => {
        dataAccess.getSongByPath(path).then((row) => {
            if (row != undefined) {
                resolve();
                return;
            }
            mm.parseFile(path).then((metadata) => {
                getAlbumFromMetadata(metadata).then((album) => {
                    getArtistFromMetadata(metadata).then((artist) => {
                        const song = new dataObject.Song(path).fromMetadata(metadata);
                        song.albumId = album.id;
                        song.artistId = artist.id;
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

const supportedFileTypes = ['.mp3', '.m4a'];
const isSupported = (file) => {
    for (let supportedFileType of supportedFileTypes) {
        if (file.endsWith(supportedFileType)) {
            return true;
        }
    }
    return false;
}
const scanFoldersForMediaFiles = () => {
    return new Promise((resolve, reject) => {
        const promises = [];
        const folders = config.getFolders();
        for (let folder of folders) {
            const dir = fs.opendirSync(folder.path);
            while (true) {
                const dirent = dir.readSync();
                if (dirent == null) {
                    break;
                }
                if (dirent.isFile()) {
                    if (isSupported(dirent.name)) {
                        promises.push(addSongFromPath(`${folder.path}/${dirent.name}`));
                    }
                }
            }
            dir.closeSync();
        }
        Promise.allSettled(promises).then(() => {
            resolve();
        });
    });
};

const getSongsByArtistId = (id) => {
    return dataAccess.getSongsByArtistId(id);
};

const getAlbumsByArtistId = (id) => {
    return dataAccess.getAlbumsByArtistId(id);
};

const getArtistById = (id) => {
    return dataAccess.getArtistById(id);
};

const getAllArtists = () => {
    return dataAccess.getAllArtists();
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
module.exports.scanFoldersForMediaFiles = scanFoldersForMediaFiles;
module.exports.getArtistById = getArtistById;
module.exports.getSongsByArtistId = getSongsByArtistId;
module.exports.getAlbumsByArtistId = getAlbumsByArtistId;
module.exports.getAllArtists = getAllArtists;