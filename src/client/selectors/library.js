export default {
    getAll: state => state.library.songs,
    getCurrentPlaylist: state => state.library.current,
    getQueue: state => state.library.queue,
    getCurrentSong: state => state.library.currentSong,
    getFeaturedTracks: state => (state.library.songs ? state.library.songs.slice(0, 10) : []),
};
