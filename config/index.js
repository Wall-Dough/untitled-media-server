const util = require('../util');
const fs = require('fs');

const CONFIG_PATH = util.relativePath('../server-config.json');

// Singleton for config
let config = undefined;

const getConfig = () => {
    if (config != undefined) {
        return config;
    }
    if (!fs.existsSync(CONFIG_PATH)) {
        config = {
            folders: []
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config), 'utf8');
        return config;
    }
    const configText = fs.readFileSync(CONFIG_PATH, 'utf8');
    config = JSON.parse(configText)
    return config;
};

const get = (key) => {
    const config = getConfig();
    return config[key];
};

const set = (key, value) => {
    const config = getConfig();
    config[key] = value;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
};

const unset = (key) => {
    const config = getConfig();
    delete config[key];
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
};

const getFolders = () => {
    const folders = get('folders');
    return folders == undefined ? [] : folders;
};

const addFolder = (folderName, folderPath) => {
    let folders = getFolders();
    folders.push({
        name: folderName,
        path: folderPath
    });
    set('folders', folders);
};

const removeFolder = (i) => {
    let folders = getFolders();
    folders.splice(i, 1);
    set('folders', folders);
};

module.exports.get = get;
module.exports.set = set;
module.exports.unset = unset;
module.exports.getFolders = getFolders;
module.exports.addFolder = addFolder;
module.exports.removeFolder = removeFolder;
