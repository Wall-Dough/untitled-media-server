require('./rest-api');
const manager = require('./manager');


manager.addSongFromPath(__dirname + '/test-audio/008-RERE.m4a').then(() => {
    manager.addSongFromPath(__dirname + '/test-audio/test.mp3').then(() => {
        manager.getAllSongs().then((rows) => {
            console.log(rows);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}).catch((err) => {
    console.log(err);
});