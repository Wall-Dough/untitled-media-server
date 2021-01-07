/**
 * @namespace webInterface
 */

const EOL = require('os').EOL;
const manager = require('../manager');

/**
 * @function getHomepage
 * @memberof webInterface
 * 
 * Obtains the string representation of the homepage
 * @returns a Promise that resolves with the string representation of the homepage
 */
const getHomepage = () => {
    return new Promise((resolve, reject) => {
        manager.getAllSongs().then((songs) => {
            manager.getAllAlbums().then((albums) => {
                let homepage = '';
                homepage += `<h3>Songs</h3>${EOL}`;
                homepage += `<ul>${EOL}`;
                for (let song of songs) {
                    homepage += `<li><a href="/songs/${song.id}/stream">${song.title}</a></li>`;
                }
                homepage += `</ul>${EOL}`;

                homepage += `<h3>Albums</h3>${EOL}`;
                homepage += `<ul>${EOL}`;
                for (let album of albums) {
                    homepage += `<li><a href="/albums/${album.id}/stream">${album.title}</a></li>`;
                }
                homepage += `</ul>${EOL}`;

                resolve(homepage);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.getHomepage = getHomepage;