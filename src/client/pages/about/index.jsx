/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import Header from 'components/header';
import MenuFooter from 'components/menu-panel/menu-footer';
import selectors from 'selectors';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Component to handle the about page
 * @returns {React.Component}
 */
function ArtistPage() {
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const dispatch = useDispatch();

    const artistClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    useEffect(() => {
        dispatch(setState('menuOpened', false));
        dispatch(setState('presetsOpened', false));
        dispatch(setState('filtersOpened', false));
    });

    return (
        <>
            <Header />
            <div className={artistClass}>
                <div className="about">
                    <div className="about__hero" />
                    <div className="about__content">
                        <div className="about__title about__title--big">A Unique Music Catalog Interface</div>
                        <div className="about__copy about__copy--wide">
                            The PatternBased Catalog is an ever expanding collection of textural/emotive sound &amp;
                            music that ranges from simple tones and drones to energetic and highly rhythmic works
                            spanning a wide variety of styles and moods. Our catalog system at catalog.patternbased.com
                            provides you a unique interface for searching and listening to our sonic catalog whether you
                            are a director, editor or artist searching for works to license for your project or you are
                            simply looking to enjoy a selection of music outside the mainstream(ing) services. It is
                            also a privacy focused system where you can browse and listen to the catalog, create and
                            share searches, playlists and tracks all without logging in.
                        </div>
                        <div className="about__title">Filters</div>
                        <div className="about__copy">
                            At the heart of the catalog’s interface are five sets of sliders that will help you filter
                            the catalog down to what you are looking for based on rhythm, speed, mood, experimental and
                            organic traits associated with the tracks. Rather than wading through genres and tag clouds,
                            we believe these sliders are a much more intuitive way to search, especially through the sum
                            total of PatternBased’s sonic compositions. You can add a traditional keyword search that
                            incorporates the more traditional searches by artist, genre, tag etc using the magnifying
                            glass icon.
                        </div>
                        <div className="about__title">Presets</div>
                        <div className="about__copy">
                            For an even quicker start, click on the preset buttons such as ‘Commerce and Happiness’ or
                            ‘Horror Drones’ which will set the filter sliders automatically. You can then refine the
                            range of the sliders to expand or further refine your search.
                        </div>
                        <div className="about__title">Suggestions</div>
                        <div className="about__copy">
                            Feel free to contact us at any point in your searching and listening if you would like to
                            talk about your project and have us help you find or create exactly what you are looking
                            for. We know our catalog inside and out. Additionally, we are always composing custom music
                            from complete scores to short beats to remixes. Anything in the catalog can be thought of as
                            a starting point for something new based on something existing. Stems for almost all pieces
                            of music are available.
                        </div>
                        <div className="about__banner about__banner--first">Our Music</div>
                        <div className="about__copy about__copy--wide">
                            At PatternBased, we have been creating music for the sake of creation and also for films and
                            other projects for over two decades with clients including Netflix, Showtime, Amazon,
                            Google, Lucasfilm, The United Nations and so much more. From the cinematic rhythms of Low in
                            the Sky to the sparse and beautiful tones of Michael Tolan and Ron Tucker. From upbeat
                            whimsical pieces to the sounds of an apocalyptic hellscape and from highly electronic to
                            highly organic. The catalog as a whole covers a lot of sonic ground and could be used for an
                            endless variety of projects.
                        </div>
                        <div className="about__title">Composing</div>
                        <div className="about__copy">
                            The case for custom music is an easy one. Every event, every scene, every thing that needs
                            music is different and therefore music should be too. A well done score and sound design can
                            convey an incredibly specific mixture of ideas and emotions. A good composer can make that
                            happen whether you are telling a story about college athletes in swampy Scooba Mississippi
                            with uncertain futures, the future of technology in Singapore or you just need a unique
                            bombastic build for the unveiling of your new brand.
                            <br /> We love the composing process and have created custom music for just about anything
                            one could think of from films and Netflix/streaming shows to VR and interactive
                            installations. We like working on unique original projects from around the world and are
                            open to a wide range of budgets depending on the project. We dream of working on a colorful
                            cartoon like Adventure Time or a VR experience that increases empathy or creates meditative
                            states or perhaps interface design for the next generation of electric vehicles. Get at us
                            with your wildest ideas.
                        </div>
                        <div className="about__title">Customizing</div>
                        <div className="about__copy">
                            Stems (also called splits) are the individual components of a piece of recorded music, like
                            drums or bass or vocals. Stems for just about every track in the catalog are available. This
                            means the music can be stripped down or easily remixed or altered for your needs. Contact us
                            if you hear a piece of music that would make a good starting point for your project.
                        </div>
                        <div className="about__banner about__banner--second">Support</div>
                        <div className="about__copy about__copy--wide">
                            PatternBased is focused on supporting artists and ideas through a variety of means including
                            discounted rates on licensing for creations involving environmental and animal protection,
                            human rights and other forward thinking projects. We work to balance these notions with our
                            best attempts to support our artists and the creatives that have contributed to building the
                            catalog by getting them paid via licensing fees and royalties.
                        </div>
                        <div className="about__title">Non-Profits and Forward Thinking Entities</div>
                        <div className="about__copy">
                            PatternBased is always interested in contributing to forward thinking projects from
                            eye-opening documentaries to mind expanding installations and just about anything else one
                            could think of. It gives us meaning to contribute to works with meaning. Works that
                            emphasize the connections we all share, the dignity of life as well as new ideas and
                            experiences. Please keep in mind that we are also working to get our artists paid for their
                            hard work as well.
                        </div>
                        <div className="about__title">Individual Artists</div>
                        <div className="about__copy">
                            One of the key goals of PatternBased is supporting our artists and attempting to make the
                            catalog artist-centric. All projects, artists and writers have individual pages that you can
                            access by clicking on the artist’s name wherever they appear. From there, you can listen to
                            all the songs that the artist has contributed to and link to the artists various pages and
                            social media sites. Artists are given equal splits on writing credits for every track they
                            have contributed to and all PB artists have access to PatternBased’s Mojave Desert
                            facilities.
                        </div>
                        <div className="about__ctas">
                            <div className="about__cta">PatternBased.com</div>
                            <div className="about__cta">Artists</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about__footer">
                <MenuFooter full={true} />
            </div>
        </>
    );
}

ArtistPage.displayName = 'ArtistPage';

export default ArtistPage;
