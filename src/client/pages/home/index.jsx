import React, { useState } from 'react';

import MusicPlayer from 'components/music-player';

import './style.scss';

/**
 * Component to handle the home page
 * @returns {React.Component}
 */
function HomePage() {
    const [selectedSong, setSelectedSong] = useState(null);

    return (
        <main className="home">
            <div className="test">
                <p
                    onClick={() =>
                        setSelectedSong('/assets/songs/Joseph Minadeo - Sounds For Scooba - 01 Into The Light.mp3')
                    }
                >
                    Intro test
                </p>
            </div>
            {selectedSong !== null && <MusicPlayer song={selectedSong} />}
        </main>
    );
}

HomePage.displayName = 'HomePage';

export default HomePage;
