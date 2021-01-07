class Group {
    fromDB(row) {
        this.id = row.group_id;
        this.name = row.name;
        return this;
    }
}

module.exports.Group = Group;