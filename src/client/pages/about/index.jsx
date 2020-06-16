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
function AboutPage() {
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
    }, []);

    return (
        <>
            <Header />
            <div className={artistClass}>
                <div className="about">
                    <div className="about__hero" />
                    <div className="about__content">
                        <div className="about__title about__title--big">A Music Catalog UI</div>
                        <div className="about__copy about__copy--wide">
                            The PatternBased Catalog is an ever expanding collection of textural/emotive sound &amp;
                            music that ranges from sparse tones and drones to rhythmic works over a variety of styles
                            and moods. catalog.patternbased.com provides you an interface for
                            searching/listening/sharing/licensing our music. Common users of the interface would be
                            directors/editors/artists looking for pieces of music to license for their projects or music
                            patrons/listeners looking to enjoy a selection of sounds outside the mainstream(ing)
                            services. It is also a privacy focused system where the user can browse and listen, create
                            playlists, and share searches/playlists/albums/songs without logging in or sharing their
                            information.
                        </div>
                        <div className="about__title">Filters</div>
                        <div className="about__copy">
                            Use the five sets of sliders to filter the catalog down to what you are looking for based on
                            rhythm, speed, mood, experimental and organic traits associated with the songs. We believe
                            these sliders are an intuitive way to search our particular set of sound &amp; music. You
                            can add traditional keyword filters for artists, projects, instruments, genres and tags by
                            using the magnifying glass icon.
                        </div>
                        <div className="about__title">Presets</div>
                        <div className="about__copy">
                            For the quickest start, click a preset such as ‘Commerce and Happiness’ or ‘Horror Drones’
                            which will set the filter sliders automatically. Then click the blue stacked play icon above
                            the search results to add the entire set of results to play queue and begin playing. You can
                            always refine the range of the sliders or add keywords to alter your search.
                        </div>
                        <div className="about__title">Suggestions</div>
                        <div className="about__copy">
                            Feel free to contact us at any point in your searching and listening if you would like to
                            talk about your project and have us help you find or create exactly what you are looking
                            for. We know our catalog inside and out (and we always have a mountain of unreleased
                            material). Additionally, we are always composing custom music from complete scores to short
                            beats to remixes. Anything in the catalog can be thought of as a starting point for
                            something new. Stems for all songs are readily available.
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
                            The case for custom sound/music is a strong one for just about any project. Every event,
                            every scene, every thing that needs music is different and thus the sound of it should be as
                            well. A well done score and sound design can convey an incredibly specific mixture of ideas
                            and emotions. A good composer can make that happen whether you are telling a story about the
                            struggles of college athletes in the Mississippi swamplands, the future of technology in
                            Singapore or you just need a unique bombastic build for the unveiling of your new label.
                            <br /> We love the composing process and have created custom music for just about anything
                            one could think of from films and Netflix/streaming shows to VR and interactive
                            installations. We like working on unique original projects from around the world and are
                            open to a wide range of budgets depending on the project. We dream of working on a colorful
                            cartoon like Tuca and Bertie or Adventure Time or a VR experience that increases empathy or
                            creates meditative states or perhaps UI sound design for the next generation of electric
                            vehicles. Get at us with your wildest ideas.
                        </div>
                        <div className="about__title">Customizing</div>
                        <div className="about__copy">
                            Stems (sometimes called splits) are the individual components of a piece of recorded music,
                            like drums or bass or vocals. Stems for just about every track in the catalog are available.
                            This means the music can be stripped down or easily remixed/altered for your needs. Contact
                            us if you hear a piece of music that would make a good starting point for your project.
                        </div>
                        <div className="about__banner about__banner--second">Support</div>
                        <div className="about__copy about__copy--wide">
                            PatternBased is focused on supporting artists such as indie filmmakers, indie game devs,
                            non-profits and other grassroots and forward thinking entities through multiple means
                            including discounted rates on licensing for creations focused on the environment, animal and
                            human rights and similar projects. We work to balance these notions with our best attempts
                            to support our recording artists and the creatives that have contributed to building this
                            catalog by getting them paid via studio fees, licensing/placement fees and royalties.
                        </div>
                        {/* <div className="about__title">Non-Profits and Forward Thinking Entities</div>
                        <div className="about__copy">
                            PatternBased is always interested in contributing to forward thinking projects from
                            eye-opening documentaries to mind expanding installations and just about anything else one
                            could think of. It gives us meaning to contribute to works with meaning. Works that
                            emphasize the connections we all share, the dignity of life as well as new ideas and
                            experiences. Please keep in mind that we are also working to get our artists paid for their
                            hard work as well.
                        </div> */}
                        <div className="about__title">Individual Artists</div>
                        <div className="about__copy">
                            We are attempting to make this catalog extremely artist-centric. All projects, artists and
                            writers have individual pages that you can access by clicking on the artist’s name wherever
                            they appear. From there, you can listen to all the songs that the artist has contributed to
                            and link to the artists various pages and social media accounts and you are encouraged to
                            contact them directly. All artists have equal splits on writing credits and the music is
                            fully open sourced between the writers to do whatever they wish with. All PB artists have
                            access to our mojave desert facilities and as well as small grants and residencies via the
                            Tiny Arts Prize via our not for profit sister entity Bunny San Tachi.
                        </div>
                        <div className="about__ctas">
                            <a href="https://patternbased.com/" target="_blank" rel="noopener noreferrer">
                                <div className="about__cta">PatternBased.com</div>
                            </a>
                            <a href="/artists" target="_blank" rel="noopener noreferrer">
                                <div className="about__cta">Artists</div>
                            </a>
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

AboutPage.displayName = 'AboutPage';

export default AboutPage;
