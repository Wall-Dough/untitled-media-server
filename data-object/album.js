class Album {
    fromMetadata(metadata) {
        const common = metadata.common;
        this.id = 0;
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
        this.id = row.album_id;
        this.title = row.title;
        this.year = row.year;
        this.artist = row.artist;
        this.genre = row.genre;
        return this;
    }
};

module.exports.Album = Album;