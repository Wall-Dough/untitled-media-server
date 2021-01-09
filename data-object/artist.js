class Artist {
    fromDB(row) {
        this.name = row.name;
        this.id = row.artist_id;
        return this;
    }
    fromMetadata(metadata) {
        this.name = metadata.common.artist;
        this.id = 0;
        return this;
    }
};

module.exports.Artist = Artist;