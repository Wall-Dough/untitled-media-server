class Album {
    fromMetadata(metadata) {
        const common = metadata.common;
        this.id = 0;
        console.log(metadata);
        this.title = common.album ? common.album : '';
        this.year = common.year ? common.year : 0;
        this.artist = common.albumArtist ? common.albumArtist :
            (common.artist ? common.artist : '');
        this.genre = common.genre ? common.genre : '';
        return this;
    }
    fromDB(row) {
        if (row == undefined) {
            return undefined;
        }
        console.log(row);
        return this;
    }
    // album_id int,
    //         title varchar(255),
    //         arist varchar(255),
    //         year int,
    //         genre varchar(255)
};

module.exports.Album = Album;