/**
 * @namespace dataAccess
 */

const sqlite3 = require('sqlite3');
const ServerError = require('../util').ServerError;

const albums = require('./albums');
const artists = require('./artists');
const folders = require('./folders');
const groups = require('./groups');
const playlists = require('./playlists');
const songs = require('./songs');

const db = new sqlite3.Database(':memory:');

const init = () => {
    return new Promise((resolve, reject) => {
        const promises = [];
        promises.push(albums.init(db));
        promises.push(artists.init(db));
        promises.push(folders.init(db));
        promises.push(groups.init(db));
        promises.push(playlists.init(db))
        promises.push(songs.init(db));
        Promise.all(promises).then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError('Failed to initialize the database', err))
        });
    });
};

module.exports.albums = albums;
module.exports.artists = artists;
module.exports.folders = folders;
module.exports.groups = groups;
module.exports.playlists = playlists;
module.exports.songs = songs;
module.exports.init = init;