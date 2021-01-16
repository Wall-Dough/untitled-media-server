const dataObject = require('../data-object');
const { ServerError } = require('../util');
const groups = require('./groups');

let db = undefined;

/**
 * @function addTag
 * @memberof dataAccess
 * 
 * Adds a new tag to the database
 * @param {string} tagName the name of the tag to add
 * @returns a Promise that resolves when the tag has been added
 */
const addTag = (tagName) => {
    return new Promise((resolve, reject) => {
        groups.addGroup(tagName, groups.Types.TAG).then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError(`Failed to add tag '${tagName}'`, err));
        });
    });
};

/**
 * @function addSongToTag
 * @memberof dataAccess
 * 
 * Adds the song to the tag
 * @param {number} tagId the ID of the tag to add the song to
 * @param {number} songId the ID of the song to add to the tag
 * @returns a Promise that resolves when the song has been added to the tag
 */
const addSongToTag = (tagId, songId) => {
    return new Promise((resolve, reject) => {
        groups.addSongToGroup(tagId, songId).then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError(`Failed to add song ID ${songId} to tag ID ${tagId}`, err));
        });
    });
};

/**
 * @function getAllTags
 * @memberof dataAccess
 * 
 * Gets all the tags in the database
 * @returns a Promise that resolves with an array of all tags
 */
const getAllTags = () => {
    return new Promise((resolve, reject) => {
        groups.getAllGroupsByTypeCd(groups.Types.TAG).then((results) => {
            const tags = results.map((group) => {
                return new dataObject.Tag().fromGroup(group);
            });
            resolve(tags);
        }).catch((err) => {
            reject(new ServerError('Failed to get all tags', err));
        });
    });
};

const getTagsBySongId = (id) => {
    return new Promise((resolve, reject) => {
        groups.getGroupsBySongId(id, groups.Types.TAG).then((results) => {
            const tags = results.map((group) => {
                return new dataObject.Tag().fromGroup(group);
            });
            resolve(tags);
        }).catch((err) => {
            reject(new ServerError(`Failed to get tags by song ID ${id}`, err));
        });
    });
};

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        resolve();
    });
};

module.exports.addTag = addTag;
module.exports.addSongToTag = addSongToTag;
module.exports.getAllTags = getAllTags;
module.exports.getTagsBySongId = getTagsBySongId;
module.exports.init = init;