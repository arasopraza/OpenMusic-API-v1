const ClientError = require('../../exceptions/ClientError');

class PlaylistSongHandler {
    constructor(playlistsService, validator) {
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.deleteSongHandler = this.deleteSongHandler.bind(this);
    }

    async postSongHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        const playlistsongId = await this._playlistsService.addSong(playlistId, songId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist',
            data: {
                playlistsongId,
            },
        });
        response.code(201);
        return response;
    }

    async getSongHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        const songs = await this._playlistsService.getSong(playlistId);

        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async deleteSongHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistsService.deleteSong(playlistId, songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }
}

module.exports = PlaylistSongHandler;