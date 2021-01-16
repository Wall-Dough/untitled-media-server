/**
 * @namespace manager
 */

const dataAccess = require('../data-access');
const dataObject = require('../data-object');
const ServerError = require('../util').ServerError;
const config = require('../config');
const mm = require('music-metadata');
const fs = require('fs');

const getAlbumFromMetadata = (metadata) => {
    return new Promise((resolve, reject) => {
        dataAccess.albums.getAlbumByTitle(metadata.common.album).then((album) => {
            if (album == undefined) {
                album = new dataObject.Album().fromMetadata(metadata);
                dataAccess.albums.addAlbum(album).then(() => {
                    dataAccess.albums.getAlbumByTitle(metadata.common.album).then((album) => {
                        resolve(album);
                    }).catch((err) => {
                        reject(new ServerError('Failed to get album from metadata', err));
                    });
                }).catch((err) => {
                    reject(new ServerError('Failed to get album from metadata', err));
                });
            } else {
                resolve(album);
            }
        }).catch((err) => {
            reject(new ServerError('Failed to get album from metadata', err));
        });
    });
};

const getArtistFromMetadata = (metadata) => {
    return new Promise((resolve, reject) => {
        dataAccess.artists.getArtistByName(metadata.common.artist).then((artist) => {
            if (artist == undefined) {
                artist = new dataObject.Artist().fromMetadata(metadata);
                dataAccess.artists.addArtist(artist).then(() => {
                    dataAccess.artists.getArtistByName(metadata.common.artist).then((artist) => {
                        resolve(artist);
                    }).catch((err) => {
                        reject(new ServerError('Failed to get artist from metadata', err));
                    });
                }).catch((err) => {
                    reject(new ServerError('Failed to get artist from metadata', err));
                });
            } else {
                resolve(artist);
            }
        }).catch((err) => {
            reject(new ServerError('Failed to get artist from metadata', err));
        });
    });
};

const addSongFromPath = (path) => {
    return new Promise((resolve, reject) => {
        dataAccess.songs.getSongByPath(path).then((row) => {
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
                        dataAccess.songs.addSong(song).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject(new ServerError(`Failed to add song from path '${path}'`, err));
                        });
                    }).catch((err) => {
                        reject(new ServerError(`Failed to add song from path '${path}'`, err));
                    });
                }).catch((err) => {
                    reject(new ServerError(`Failed to add song from path '${path}'`, err));
                });
            }).catch((err) => {
                reject(new ServerError(`Failed to add song from path '${path}'`, err));
            });
        }).catch((err) => {
            reject(new ServerError(`Failed to add song from path '${path}'`, err));
        });
    });
};

const getAllSongs = () => {
    return dataAccess.songs.getAllSongs();
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
    return dataAccess.songs.getSongById(id);
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
    return dataAccess.songs.getSongsByAlbumId(id);
};

/**
 * @see {@link dataAccess.getAllAlbums}
 */
const getAllAlbums = () => {
    return dataAccess.albums.getAllAlbums();
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
    return dataAccess.playlists.addPlaylist(playlistName);
};

/**
 * @function getAllPlaylists
 * @memberof manager
 * 
 * Gets all the playlists in the database
 * @returns a Promise that resolves with an array of all playlists
 */
const getAllPlaylists = () => {
    return dataAccess.playlists.getAllPlaylists();
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
    return dataAccess.playlists.addSongToPlaylist(playlistId, songId);
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
    return dataAccess.songs.getSongsByPlaylistId(id);
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

const scanFolderForMediaFiles = (path, promises) => {
    const dir = fs.opendirSync(path);
    while (true) {
        const dirent = dir.readSync();
        if (dirent == null) {
            break;
        }
        if (dirent.isFile() && isSupported(dirent.name)) {
            promises.push(addSongFromPath(`${path}/${dirent.name}`));
        } else if (dirent.isDirectory()) {
            scanFolderForMediaFiles(`${path}/${dirent.name}`, promises);
        }
    }
    dir.closeSync();
};

const scanFoldersForMediaFiles = () => {
    return new Promise((resolve, reject) => {
        const promises = [];
        const folders = config.getFolders();
        for (let folder of folders) {
            scanFolderForMediaFiles(folder.path, promises);
        }
        Promise.all(promises).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
};

const getSongsByArtistId = (id) => {
    return dataAccess.songs.getSongsByArtistId(id);
};

const getAlbumsByArtistId = (id) => {
    return dataAccess.albums.getAlbumsByArtistId(id);
};

const getArtistById = (id) => {
    return dataAccess.artists.getArtistById(id);
};

const getAllArtists = () => {
    return dataAccess.artists.getAllArtists();
};

const getAllStarredAlbums = () => {
    return dataAccess.albums.getAllStarredAlbums();
}

const setStarredForAlbumId = (id, starred) => {
    return dataAccess.albums.setStarredForAlbumId(id, starred);
}

const getAllStarredSongs = () => {
    return dataAccess.songs.getAllStarredSongs();
}

const setStarredForSongId = (id, starred) => {
    return dataAccess.songs.setStarredForSongId(id, starred);
}

const getSongsByFilter = (filter) => {
    return dataAccess.songs.getSongsByFilter(filter);
}

const addTag = (tagName) => {
    return dataAccess.tags.addTag(tagName);
}

const getTagsBySongId = (id) => {
    return dataAccess.tags.getTagsBySongId(id);
}

const getSongsByTagIds = (ids) => {
    return dataAccess.songs.getSongsByTagIds(ids);
}

const addSongToTag = (tagId, songId) => {
    return dataAccess.tags.addSongToTag(tagId, songId);
}

const getAllTags = () => {
    return dataAccess.tags.getAllTags();
}

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
module.exports.getAllStarredAlbums = getAllStarredAlbums;
module.exports.setStarredForAlbumId = setStarredForAlbumId;
module.exports.getAllStarredSongs = getAllStarredSongs;
module.exports.setStarredForSongId = setStarredForSongId;
module.exports.getTagsBySongId = getTagsBySongId;
module.exports.getSongsByTagIds = getSongsByTagIds;
module.exports.addSongToTag = addSongToTag;
module.exports.getAllTags = getAllTags;
module.exports.addTag = addTag;