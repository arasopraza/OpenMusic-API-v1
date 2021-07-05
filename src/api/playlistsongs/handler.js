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
        try {
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
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getSongHandler(request, h) {
        try {
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
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteSongHandler(request, h) {
        try {
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
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistSongHandler;