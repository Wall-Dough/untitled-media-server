/**
 * @namespace dataAccess
 */

const sqlite3 = require('sqlite3');

const albums = require('./albums');
const artists = require('./artists');
const groups = require('./groups');
const playlists = require('./playlists');
const songs = require('./songs');

const db = new sqlite3.Database(':memory:');

const init = () => {
    const promises = [];
    promises.push(albums.init(db));
    promises.push(artists.init(db));
    promises.push(groups.init(db));
    promises.push(playlists.init(db))
    promises.push(songs.init(db));
    return Promise.allSettled(promises);
};

module.exports.albums = albums;
module.exports.artists = artists;
module.exports.groups = groups;
module.exports.playlists = playlists;
module.exports.songs = songs;
module.exports.init = init;