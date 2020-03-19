export default {
    getAll: state => state.library.songs,
    getCurrentPlaylist: state => state.library.current,
    getQueue: state => state.library.queue,
    getCurrentSong: state => state.library.currentSong,
    getCustomWorkSong: state => state.library.customWorkSong,
    getLicenseSong: state => state.library.licenseSong,
};
