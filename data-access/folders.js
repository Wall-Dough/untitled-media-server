const ServerError = require("../util").ServerError;

let db = undefined;

const insertBlankFolder = () => {
    return new Promise((resolve, reject) => {
        db.run(`insert into FOLDERS (folder_id, name, parent_folder_id, depth)
        values (0, '', 0, 0);`, (err) => {
            if (err) {
                reject(new ServerError('Failed to insert a blank folder', err));
            } else {
                console.log('Inserted blank folder');
                resolve();
            }
        });
    })
};

const createFoldersTable = () => {
    return new Promise((resolve, reject) => {
        db.run(`create table FOLDERS (
            folder_id INTEGER PRIMARY KEY,
            name TEXT,
            parent_folder_id INTEGER,
            depth INTEGER
            unique(parent_folder_id, name)
            );`, (err) => {
                if (err) {
                    reject(new ServerError('Failed to create folders table', err));
                } else {
                    console.log('Created folders table');
                    insertBlankFolder().then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
    });
};

const addFolder = (folder) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into FOLDERS (name, parent_folder_id, depth)
        values ($name, $parentId, $depth)`, folder.toDB(), (err) => {
            if (err) {
                if (err.errno == 19 && err.message.includes('UNIQUE constraint failed')) {
                    resolve();
                } else {
                    reject(new ServerError(`Failed to add folder '${folder.name}'`, err));
                }
            } else {
                console.log(`Added folder '${folder.name}'`);
                resolve();
            }
        });
    });
};

const init = (theDB) => {
    db = theDB;
    return new Promise((resolve, reject) => {
        createFoldersTable().then(() => {
            resolve();
        }).catch((err) => {
            reject(new ServerError('Failed to initialize folders', err));
        });
    });
};

module.exports.addFolder = addFolder;
module.exports.init = init;