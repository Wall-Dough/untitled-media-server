class Folder {
    fromDB(row) {
        this.id = row.folder_id;
        this.parentId = row.parent_folder_id;
        this.name = row.name;
        this.depth = row.depth;
    }
    toDB() {
        const db = {};
        db.$parentId = this.parentId;
        db.$name = this.name;
        db.$depth = this.depth;
        return db;
    }
}