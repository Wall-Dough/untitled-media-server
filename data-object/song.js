class Song {
    constructor(filePath) {
        this.filePath = filePath;
    }
    fromMetadata(metadata) {
        const common = metadata.common;
        this.id = 0;
        this.title = common.title ? common.title : '';
        this.artist = common.artist ? common.artist : '';
        this.album = common.album ? common.album : '';
        this.discNumber = common.disk.no ? common.disk.no : 0;
        this.trackNumber = common.track.no ? common.track.no : 0;
        this.year = common.year ? common.year : 0;
        this.genre = '';
        // this.tags = common.tags;
        // this.starred = common.starred;
        // this.filePath = common.filePath;
        return this;
    }
    fromDB(row) {
        this.id = row.song_id;
        this.title = row.title == undefined ? '' : row.title;
        this.title = this.title.trim() == '' ? 'Untitled song' : this.title;
        this.artist = row.artist == undefined ? '' : row.artist;
        this.artist = this.artist.trim() == '' ? 'Unknown artist' : this.artist;
        this.album = row.album == undefined ? '' : row.album;
        this.album - this.album.trim() == '' ? 'Unknown album' : this.album;
        this.albumId = row.album_id;
        this.discNumber = row.disc;
        this.trackNumber = row.track;
        this.year = row.year;
        this.genre = row.genre;
        this.filePath = row.file_path;
        return this;
    }
};

module.exports.Song = Song;