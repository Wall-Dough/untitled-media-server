/**
 * @namespace util
 */

const EOL = require('os').EOL;

const relativePath = (path) => {
    const splitPath = path.split('/');
    const splitDir = __dirname.split('/');
    while (splitPath[0] == '..') {
        if (splitDir.length == 1) {
            throw 'Invalid relative path';
        }
        splitPath.shift();
        splitDir.pop();
    }
    return splitDir.concat(splitPath).join('/');
};

/**
 * @function createPLS
 * @memberof util
 * 
 * Creates a PLS file string for the given array of song IDs
 * @param {string} hostname the current base hostname URL
 * @param {Array.<Number>} ids an array of song IDs for the playlist
 */
const createPLS = (hostname, ids) => {
    let plsString = '[playlist]';
    let i = 0;
    for (let id of ids) {
        plsString += EOL + 'File' + (++i).toString() + '=';
        plsString += 'http://' + hostname + '/songs/' + id.toString() + '/file';
    }
    plsString += EOL + 'NumberOfEntries=' + ids.length;
    return plsString;
};

class ServerError {
    constructor(message, cause) {
        this.message = message;
        if (cause) {
            this.message += `:${EOL}  ${cause.message}`;
        }
    }
}

module.exports.relativePath = relativePath;
module.exports.createPLS = createPLS;
module.exports.ServerError = ServerError;