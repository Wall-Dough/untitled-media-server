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

module.exports.relativePath = relativePath;