const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._songs = [];
    }

    addSong({ title, year, performer, genre, duration }) {
        const songId = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newSong = {
            songId, title, year, performer, genre, duration, insertedAt, updatedAt,
        };

        this._songs.push(newSong);

        const isSuccess = this._songs.filter((song) => song.songId === songId).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        console.log(newSong);

        return songId;
    }

    getSongs() {
        return this._songs.map((song) => ({
            id: song.songId,
            title: song.title,
            performer: song.performer,
        }));
    }

    getSongById(songId) {
        const song = this._songs.filter((n) => n.songId === songId)[0];

        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return song;
    }

    editSongById(songId, { title, year, performer, genre, duration }) {
        const index = this._songs.findIndex((song) => song.songId === songId);

        if (index === -1) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }

        const updatedAt = new Date().toISOString();

        this._songs[index] = {
            ...this._songs[index],
            title,
            year,
            performer,
            genre,
            duration,
            updatedAt,
        };
    }

    deleteSongById(songId) {
        const index = this._songs.findIndex((song) => song.songId === songId);

        if (index === -1) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }

        this._songs.splice(index, 1);
    }
}

module.exports = SongsService;