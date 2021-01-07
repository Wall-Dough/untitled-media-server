require('./data-access').init().then(() => {
    const manager = require('./manager');
    require('./rest-api');

    manager.scanFoldersForMediaFiles().then(() => {
        manager.getAllSongs().then((songs) => {
            console.log(songs);
        }).catch((err) => {
            console.log(err);
        });
        manager.getAllAlbums().then((albums) => {
            console.log(albums);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});