class Filter {
    constructor() {
        this.starred = undefined;
        this.playlistId = 0;
        this.artistId = 0;
        this.albumId = 0;
    }
    withStarred(starred) {
        this.starred = starred;
        return this;
    }
    withPlaylistId(playlistId) {
        this.playlistId = playlistId;
        return this;
    }
    withArtistId(artistId) {
        this.artistId = artistId;
        return this;
    }
    withAlbumId(albumId) {
        this.albumId = albumId;
        return this;
    }
    toDB() {
        const db = {};
        if (this.starred != undefined) {
            db.$starred = this.starred;
        }
        if (this.playlistId > 0) {
            db.$playlistId = this.playlistId;
        }
        if (this.artistId > 0) {
            db.$artistId = this.artistId;
        }
        if (this.albumId > 0) {
            db.$albumId = this.albumId;
        }
        return db;
    }
}

module.exports.Filter = Filter;