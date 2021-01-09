const dataObject = require('../data-object');

let db = undefined;

const Types = {};
Types.PLAYLIST = 1;

const insertBlankGroup = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS (group_id, name, type_cd)
        values (0, '', 0)`, (err) => {
            if (err) {
                console.log('Insert blank group failed');
                reject(err);
            } else {
                console.log('Inserted blank group');
                resolve();
            }
        })
    });
};

const createGroupsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table GROUPS (
            group_id INTEGER PRIMARY KEY,
            name TEXT,
            type_cd INTEGER
            );`, (err) => {
                if (err) {
                    console.log('Create groups table failed');
                    reject(err);
                } else {
                    console.log('Created groups table');
                    insertBlankGroup().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const insertBlankGroupsSongsRow = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS_SONGS (group_id, song_id)
        values (0, 0)`, (err) => {
            if (err) {
                console.log('Insert blank groups songs row failed');
                reject(err);
            } else {
                console.log('Inserted blank groups songs row');
                resolve();
            }
        })
    });
};

const createGroupsSongsTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table GROUPS_SONGS (
            group_id INTEGER,
            song_id INTEGER
            );`, (err) => {
                if (err) {
                    console.log('Create groups and songs table failed');
                    reject(err);
                } else {
                    console.log('Created groups and songs table');
                    insertBlankGroupsSongsRow().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const addGroup = (groupName, typeCode) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS (name, type_cd)
        values ($name, $typeCd);`, {
            $name: groupName,
            $typeCd: typeCode
        }, (err) => {
            if (err) {
                console.log('Add group failed');
                reject(err);
            } else {
                console.log('Added group');
                resolve();
            }
        });
    });
};

const addSongToGroup = (groupId, songId) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into GROUPS_SONGS (group_id, song_id)
        values ($groupId, $songId);`, {
            $groupId: groupId,
            $songId: songId
        }, (err) => {
            if (err) {
                console.log('Add song to group failed');
                reject(err);
            } else {
                console.log('Added song to group');
                resolve();
            }
        });
    });
};

const getAllGroupsByTypeCd = (typeCd) => {
    return new Promise((resolve, reject) => {
        db.all(`select *
        from GROUPS
        where type_cd = $typeCd;`, {
            $typeCd: typeCd
        }, (err, rows) => {
            if (err) {
                console.log('Get groups by type cd failed');
                reject(err);
            } else {
                console.log('Got groups by type cd');
                const results = [];
                for (let row of rows) {
                    results.push(new dataObject.Group().fromDB(row));
                }
                resolve(results);
            }
        });
    });
};

const init = (theDB) => {
    db = theDB;
    const promises = [];
    promises.push(createGroupsTable());
    promises.push(createGroupsSongsTable());
    return Promise.allSettled(promises);
};

module.exports.Types = Types;
module.exports.addGroup = addGroup;
module.exports.addSongToGroup = addSongToGroup;
module.exports.getAllGroupsByTypeCd = getAllGroupsByTypeCd;
module.exports.init = init;