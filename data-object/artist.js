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
    toDB() {
        const db = {};
        db.$name = this.name;
        return db;
    }
};

module.exports.Artist = Artist;