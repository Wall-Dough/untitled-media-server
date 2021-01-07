class Playlist {
    fromGroup(group) {
        this.id = group.id;
        this.name = group.name;
        return this;
    }
};

module.exports.Playlist = Playlist;