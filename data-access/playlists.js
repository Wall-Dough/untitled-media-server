const dataObject = require('../data-object');
const groups = require('./groups');

let db = undefined;

/**
 * @function addPlaylist
 * @memberof dataAccess
 * 
 * Adds a new empty playlist to the database
 * @param {string} playlistName the name of the playlist to add
 * @returns a Promise that resolves when the playlist has been added
 */
const addPlaylist = (playlistName) => {
    return groups.addGroup(playlistName, groups.Types.PLAYLIST);
};

/**
 * @function addSongToPlaylist
 * @memberof dataAccess
 * 
 * Adds the song to the playlist
 * @param {number} playlistId the ID of the playlist to add the song to
 * @param {number} songId the ID of the song to add to the playlist
 * @returns a Promise that resolves when the song has been added to the playlist
 */
const addSongToPlaylist = (playlistId, songId) => {
    return groups.addSongToGroup(playlistId, songId);
};

/**
 * @function getAllPlaylists
 * @memberof dataAccess
 * 
 * Gets all the playlists in the database
 * @returns a Promise that resolves with an array of all playlists
 */
const getAllPlaylists = () => {
    return new Promise((resolve, reject) => {
        groups.getAllGroupsByTypeCd(groups.Types.PLAYLIST).then((results) => {
            const playlists = results.map((group) => {
                return new dataObject.Playlist().fromGroup(group);
            });
            resolve(playlists);
        }).catch((err) => {
            reject(err);
        });
    });
};

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        resolve();
    });
};

module.exports.addPlaylist = addPlaylist;
module.exports.addSongToPlaylist = addSongToPlaylist;
module.exports.getAllPlaylists = getAllPlaylists;
module.exports.init = init;