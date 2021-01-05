const util = require('../util');
const fs = require('fs');

const CONFIG_PATH = '../config.json';

const getConfig = () => {
    const configPath = util.relativePath(CONFIG_PATH);
    if (!fs.existsSync(configPath)) {
        const configText = `{
            // An array of absolute paths of folders to index
            folders: []
        }`;
        fs.writeFileSync(configPath, configText, 'utf8');
    }
    const configText = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configText);
};

module.exports.getConfig = getConfig;