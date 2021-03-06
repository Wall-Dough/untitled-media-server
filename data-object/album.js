class Album {
    fromMetadata(metadata) {
        const common = metadata.common;
        this.id = 0;
        this.title = common.album ? common.album : '';
        this.year = common.year ? common.year : 0;
        this.artist = common.albumArtist ? common.albumArtist :
            (common.artist ? common.artist : '');
        this.genre = common.genre ? common.genre : '';
        this.starred = false;
        return this;
    }
    fromDB(row) {
        if (row == undefined) {
            return undefined;
        }
        this.id = row.album_id;
        this.title = row.title == undefined ? '' : row.title;
        this.title = this.title.trim() == '' ? 'Unknown album' : this.title;
        this.year = row.year;
        this.artist = row.artist == undefined ? '' : row.artist;
        this.artist = this.artist.trim() == '' ? 'Unknown album artist' : this.artist;
        this.genre = row.genre;
        this.starred = row.starred > 0;
        return this;
    }
    toDB() {
        const db = {};
        db.$title = this.title;
        db.$year = this.year;
        db.$artist = this.artist;
        db.$genre = this.genre;
        db.$starred = this.starred;
        return db;
    }
};

module.exports.Album = Album;