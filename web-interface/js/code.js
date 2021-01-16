var queue = undefined;
var currentSong = -1;

function clearAllElements() {
    var divContainer = document.getElementById("items");
    divContainer.innerHTML = "";
}

function addElement(text, onclick) {
    var divContainer = document.getElementById("items");
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    row.setAttribute("onclick", onclick);

    var col = document.createElement("div");
    col.setAttribute("class", "col-sm");
    col.innerHTML = text;
    row.appendChild(col);
    divContainer.appendChild(row);
}

function playSong(i) {
    if (queue == undefined) {
        return;
    }
    if (i < 0 || i >= queue.length) {
        currentSong = -1;
        return;
    }
    currentSong = i;
    var nowPlaying = document.getElementById("now-playing");
    nowPlaying.innerHTML = "";
    var audio = document.createElement("audio");
    audio.setAttribute("controls", true);
    audio.setAttribute("autoplay", true);
    audio.setAttribute("onended", "nextSong();");
    var source = document.createElement("source");
    source.setAttribute("src", "/songs/" + queue[i].id.toString() + "/file");
    source.setAttribute("type", "audio/mpeg");
    audio.appendChild(source);
    nowPlaying.appendChild(audio);
}

function nextSong() {
    playSong(++currentSong);
}

function showSongsForAlbum(id) {
    var songsRequest = new XMLHttpRequest();
    songsRequest.open("GET", "/albums/" + id.toString() + "/songs");
    songsRequest.send();
    songsRequest.onload = function (e) {
        var songs = JSON.parse(songsRequest.responseText);
        queue = songs;
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var i = 0; i < songs.length; i++) {
            addElement(songs[i].title, "playSong(" + i.toString() + ");");
        }
    }
}

function showSongsForPlaylist(id) {
    var songsRequest = new XMLHttpRequest();
    songsRequest.open("GET", "/playlists/" + id.toString() + "/songs");
    songsRequest.send();
    songsRequest.onload = function (e) {
        var songs = JSON.parse(songsRequest.responseText);
        queue = songs;
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var i = 0; i < songs.length; i++) {
            addElement(songs[i].title, "playSong(" + i.toString() + ");");
        }
    }
}

function showAlbumsForArtist(id) {
    var albumsRequest = new XMLHttpRequest();
    albumsRequest.open("GET", "/artists/" + id.toString() + "/albums");
    albumsRequest.send();
    albumsRequest.onload = function (e) {
        var albums = JSON.parse(albumsRequest.responseText);
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var album of albums) {
            addElement(album.title, "showSongsForAlbum(" + album.id.toString() + ");");
        }
    }
}

function showAlbums() {
    var albumsRequest = new XMLHttpRequest();
    albumsRequest.open("GET", "/albums");
    albumsRequest.send();
    albumsRequest.onload = function (e) {
        var albums = JSON.parse(albumsRequest.responseText);
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var album of albums) {
            addElement(album.title, "showSongsForAlbum(" + album.id.toString() + ");");
        }
    };
}

function showSongs() {
    var songsRequest = new XMLHttpRequest();
    songsRequest.open("GET", "/songs");
    songsRequest.send();
    songsRequest.onload = function (e) {
        var songs = JSON.parse(songsRequest.responseText);
        queue = songs;
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var i = 0; i < songs.length; i++) {
            addElement(songs[i].title, "playSong(" + i.toString() + ");");
        }
    }
}

function showArtists() {
    var artistsRequest = new XMLHttpRequest();
    artistsRequest.open("GET", "/artists");
    artistsRequest.send();
    artistsRequest.onload = function (e) {
        var artists = JSON.parse(artistsRequest.responseText);
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var artist of artists) {
            addElement(artist.name, "showAlbumsForArtist(" + artist.id.toString() + ");");
        }
    };
}

function showPlaylists() {
    var playlistsRequest = new XMLHttpRequest();
    playlistsRequest.open("GET", "/playlists");
    playlistsRequest.send();
    playlistsRequest.onload = function (e) {
        var playlists = JSON.parse(playlistsRequest.responseText);
        clearAllElements();

        addElement("Back", "showMainMenu();");
        
        for (var playlist of playlists) {
            addElement(playlist.name, "showSongsForPlaylist(" + playlist.id.toString() + ");");
        }
    };
}

function scanFoldersForMediaFiles() {
    var playlistsRequest = new XMLHttpRequest();
    playlistsRequest.open("POST", "/folders");
    playlistsRequest.send();
}

var menuItems = [
    ["Artists", "showArtists();"],
    ["Albums", "showAlbums();"],
    ["Songs", "showSongs();"],
    ["Playlists", "showPlaylists();"],
    ["Scan folders for media files", "scanFoldersForMediaFiles();"]
];

function showMainMenu() {
    clearAllElements();
    for (var item of menuItems) {
        addElement(item[0], item[1]);
    }
}

function init() {
    showMainMenu();
}

window.onload = function () {
    init();
}