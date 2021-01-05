require('./rest-api');
const manager = require('./manager');

const addSongs1 = new Promise((resolve, reject) => {
    manager.addSongFromPath(__dirname + '/test-audio/007-nameless.m4a').then(() => {
        manager.addSongFromPath(__dirname + '/test-audio/008-RERE.m4a').then(() => {
            manager.addSongFromPath(__dirname + '/test-audio/test.mp3').then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    }).catch((err) => {
        reject(err);
    })
});

addSongs1.then(() => {
    manager.getAllSongs().then((rows) => {
        console.log(rows);
    }).catch((err) => {
        console.log(err);
    });
}).catch((err) => {
    console.log(err);
});