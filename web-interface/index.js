/**
 * @namespace webInterface
 */

const EOL = require('os').EOL;
const manager = require('../manager');
const util = require('../util');
const fs = require('fs');

/**
 * @function getHomepage
 * @memberof webInterface
 * 
 * Obtains the string representation of the homepage
 * @returns a Promise that resolves with the string representation of the homepage
 */
const getHomepage = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(util.relativePath('../web-interface/head.html'), (err, head) => {
            fs.readFile(util.relativePath('../web-interface/body.html'), (err, body) => {
                resolve(`<html>
                ${head}
                ${body}
                </html>`);
            });
        })
    });
};

module.exports.getHomepage = getHomepage;