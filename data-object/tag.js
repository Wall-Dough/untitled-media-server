class Tag {
    fromGroup(group) {
        this.id = group.id;
        this.name = group.name;
        return this;
    }
};

module.exports.Tag = Tag;