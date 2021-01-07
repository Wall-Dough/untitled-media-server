require('./data-access').init().then(() => {
    const manager = require('./manager');
    require('./rest-api');
});