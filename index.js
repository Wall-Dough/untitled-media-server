const EOL = require('os').EOL;

require('./data-access').init().then(() => {
    const manager = require('./manager');
    require('./rest-api');
}).catch((err) => {
    console.error(err.message);
});