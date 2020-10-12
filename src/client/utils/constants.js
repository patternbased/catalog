export const HEADER_HEIGHTS = {
    small: 60,
    big: 80,
};

export const LICENSE_TYPES = [
    'Indie Film License',
    'Small Business License',
    'Small Non-Profit License',
    'Individual Artist License',
    'Personal Video License',
    'Podcast License',
    'Other License',
    'I don’t know yet',
];

export const CUSTOM_LICENSE_TYPES = {
    'Films & Shows': ['Major Films', 'Indie Films', 'Series'],
    'Commercials & Projects': ['National Ads', 'Web Streaming Ads', 'Small Business', 'Small Non-Profit'],
    'Art & Experiences': ['VR / AR Experiences', 'Game / UI', 'Art Installation', 'Individual Artist'],
    Personal: [],
    Podcast: ['Personal - Single', 'Personal - Series', 'Business - Single', 'Business - Series'],
};

export const BUY_LICENSE_TYPES = {
    'Films & Shows': {
        parent: true,
        children: {
            'Major Films': {
                custom: true,
                description: 'Films created within the studio system. Please contact us for custom license.',
            },
            'Indie Films': {
                custom: false,
                description: 'Films created of any length outside the studio system.',
                details: {
                    'Number of Uses': 'Single (1) use',
                    Distribution: 'Film Festival, Unpaid Web',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual wishing to license one master recording and composition embodied thereon (“Musical Work”, as defined in the attached Standard Terms and Conditions) for the creation of an independent film, created outside of a formal film studio system, either short or feature length.',
                    'Non-Permitted Content':
                        'The creation of any film being funded and/or released by a formal film studio, or any commercial use relating to a business, non-profit, product or service.',
                    Notes:
                        'If your film should be picked up for distribution, or shown outside of the confines of a film festival, please contact license@patternbased.com.',
                    prices: { 'Indie Film License': 250 },
                },
                footerType: 'fullLicense',
            },
            Series: {
                custom: true,
                description:
                    'Series of content produced for broadcast via national broadcast network, online streaming services, or cable. Please contact us for custom license.',
            },
        },
        footerType: 'fullLicense',
    },
    'Commercials & Projects': {
        parent: true,
        children: {
            'National Ads': {
                custom: true,
                description:
                    'Advertisements aired on any National Broadcast Network. Please contact us for custom license. ',
            },
            'Web Streaming Ads': {
                custom: true,
                description:
                    'Advertisements aired on any major web streaming platform. Please contact us for custom license. ',
            },
            'Small Business': {
                custom: false,
                description: 'Short videos or advertisements created for and by a small business.',
                details: {
                    'Number of Uses': 'Single (1) use',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual wishing to license one master recording and composition embodied thereon (“Musical Work”, as defined in the attached Standard Terms and Conditions) for the creation of a film or slideshow that highlights an organization as a whole. Content may include company highlights, event coverage, culture highlights, and employee insights - films that give an overall sense of the spirit of the organization.',
                    'Non-Permitted Content':
                        'Fundraising campaign, political campaign, call to action, or any film that highlights a specific product or service of the organization. These uses require a custom license.',
                    prices: {
                        '1 - 20 employees': 250,
                        '21 - 50 employees': 500,
                        '51 - 100 employees': 750,
                        '101 - 250 employees': 1000,
                    },
                },
            },
            'Small Non-Profit': {
                custom: false,
                description: 'Short videos or advertisements created for and by a small Non-profit organization.',
                details: {
                    'Number of Uses': 'Single (1) use',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual wishing to license one master recording and composition embodied thereon (“Musical Work”, as defined in the attached Standard Terms and Conditions) for the creation of a film or slideshow that highlights a registered non-profit organization as a whole. Content may include company highlights, event coverage, culture highlights, and employee insights - films that give an overall sense of the spirit of the organization. A company is considered a Non-Profit only if it is registered with the government as an eligible and official Non-Profit Organization. In the U.S.A., for example, a Non-Profit is designated by the IRS as a 501(c).',
                    'Non-Permitted Content':
                        'Fundraising campaign, political campaign, call to action, or any film that highlights a specific product or service of the organization. These uses require a custom license.',
                    prices: {
                        '1 - 20 employees': 150,
                        '21 - 50 employees': 350,
                        '51 - 100 employees': 500,
                        '101 - 250 employees': 750,
                    },
                },
                footerType: 'specialLicense',
            },
        },
    },
    'Art & Experiences': {
        parent: true,
        children: {
            'VR / AR Experiences': {
                custom: true,
                description:
                    'VR (Virtual Reality) and AR (Augmented Reality) experiences. Please contact us for custom license.',
            },
            'Game / UI': {
                custom: true,
                description:
                    'Games and UI (user interface) for any game and web platform. Please contact us for custom license.',
            },
            'Art Installation': {
                custom: true,
                description: 'Art installation for art exhibitions and events. Please contact us for custom license.',
            },
            'Individual Artist': {
                custom: false,
                description: 'Creations of any individual artists.',
                details: {
                    'Number of Uses': 'Single (1) use',
                    Distribution: 'Hardcopy and world wide web, not including premium streaming services',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual wishing to license one master recording and composition embodied thereon (“Musical Work”, as defined in the attached Standard Terms and Conditions) for the artwork by an individual artist.',
                    'Non-Permitted Content':
                        'Content cannot be tied to any business whatsoever, including company or product highlights, by being posted on business websites, Vimeo or YouTube accounts. If you are being paid, making money, or having sponsor, these use require custom license.',
                    prices: {
                        'Individual Artist License': 40,
                    },
                },
                footerType: 'fullLicense',
            },
        },
        footerType: 'fullLicense',
    },
    Personal: {
        parent: false,
        description: 'Tracks for reminiscing with family and friends. (Wedding / Home video / Photo slideshow)',
        details: {
            'Number of Uses': 'Single (1) use',
            Distribution: 'Hardcopy and world wide web, not including premium streaming services',
            Lifespan: 'Perpetual',
            'Permitted Content':
                'You are an individual wishing to license one master recording and composition embodied thereon (“Musical Work”, as defined in the attached Standard Terms and Conditions) for the creation of a film intended for individual, personal use only of content highlighting the life and experiences of the individual.',
            'Non-Permitted Content':
                'Content cannot be tied to any business whatsoever, including company or product highlights, by being posted on business websites, Vimeo or YouTube accounts, or if you are being paid, making money, or anticipating growing any business from the film.',
            prices: {
                'Personal License': 75,
            },
        },
    },
    Podcast: {
        parent: true,
        children: {
            'Personal - Single': {
                custom: false,
                description: 'A podcast program created by an individual.',
                details: {
                    'Number of Uses': 'Single (1) use',
                    Distribution: 'Podcast',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual creating a podcast and wish to license one master recording and composition embodied thereon (“Musical Work”, as defined in the attached Standard Terms and Conditions) solely for use as a “bumpers,” “underscore,” “intros,” “outros,” “transitions” or “beds” within a single audio podcast episode.',
                    'Non-Permitted Content':
                        'This is strictly limited to a podcast of a personal nature, unrelated to any business purpose whatsoever, whether organized or unincorporated and either “for profit” or “not for profit.” The podcast will not be directly or indirectly associated with a commercial or promotional endeavor of any nature whatsoever, including without limitation, any service or product, nor will the podcast be posted on business websites, Vimeo or YouTube. You may not derive revenue or anticipate growing any business from the podcast. You are prohibited from using the Musical Work as the subject or focus of the podcast. You are prohibited from using the Musical Work in connection with visual works of any nature whatsoever.',
                    prices: {
                        'Podcast Personal - Single Use': 50,
                    },
                },
                footerType: 'fullLicense',
            },
            'Personal - Series': {
                custom: false,
                description: 'A series of podcast programs created by an individual.',
                details: {
                    'Number of Uses':
                        'Series use (any number of episodes pertaining to one particular, identifiable podcast in a twelve month period)',
                    Distribution: 'Podcast',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual creating a podcast and wish to license one Musical Work solely for use as a “bumpers,” “underscore,” “intros,” “outros,” “transitions” or “beds” in any number of episodes pertaining to one identifiable audio podcast series in a 12-month period.',
                    'Non-Permitted Content':
                        'This is strictly limited to a podcast of a personal nature, unrelated to any business purpose whatsoever, whether organized or unincorporated and either “for profit” or “not for profit.” The podcast will not be directly or indirectly associated with a commercial or promotional endeavor of any nature whatsoever including without limitation, any service or product, nor will the podcast be posted on business websites, Vimeo or YouTube. You may not derive revenue or anticipate growing any business from the podcast. You are prohibited from using the Musical Work as the subject or focus of the podcast. You are prohibited from using the Musical Work in connection with visual works of any nature whatsoever.',
                    prices: {
                        'Podcast Personal - Series Use': 100,
                    },
                },
                footerType: 'fullLicense',
            },
            'Business - Single': {
                custom: false,
                description: 'A podcast program created by a business entity.',
                details: {
                    'Number of Uses': 'Single (1) use',
                    Distribution: 'Podcast',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual, partnership, corporation or other entity engaged in a “for profit” or “not for profit” business enterprise consisting of up to 100 employees creating a podcast and wish to license one Musical Work solely for use as a “bumpers,” “underscore,” “intros,” “outros,” “transitions” or “beds” within a single audio podcast episode. Your podcast incorporating the Musical Work is related to your business.',
                    'Non-Permitted Content':
                        'You are prohibited from using the Musical Work as the subject or focus of the podcast. You are prohibited from using the Musical Work in connection with visual works of any nature whatsoever.',
                    prices: {
                        'Podcast Business - Single Use': 75,
                    },
                },
                footerType: 'fullLicense',
            },
            'Business - Series': {
                custom: false,
                description: 'A series of podcast programs created by a business entity.',
                details: {
                    'Number of Uses':
                        'Series use (any number of episodes pertaining to one particular, identifiable podcast in a twelve month period)',
                    Distribution: 'Podcast',
                    Lifespan: 'Perpetual',
                    'Permitted Content':
                        'You are an individual, partnership, corporation or other entity engaged in a “for profit” or “not for profit” business enterprise consisting of up to 100 employees creating a podcast and wish to license one Musical Work solely for use as a “bumpers,” “underscore,” “intros,” “outros,” “transitions” or “beds” in any number of episodes pertaining to one identifiable audio podcast series in a 12-month period. Your podcast incorporating the Musical Work is related to your business.',
                    'Non-Permitted Content':
                        'You are prohibited from using the Musical Work as the subject or focus of the podcast. You are prohibited from using the Musical Work in connection with visual works of any nature whatsoever.',
                    prices: {
                        'Podcast Business - Series Use': 250,
                    },
                },
                footerType: 'fullLicense',
            },
        },
        footerType: 'fullLicense',
    },
};

export const INITIAL_FILTER_VALUES = {
    rhythm: [0, 10],
    speed: [0, 10],
    experimental: [0, 10],
    mood: [0, 10],
    grid: [0, 10],
    duration: [],
    flow: [],
    instruments: [],
    search: [],
};

export const BASIC_FILTERS = ['rhythm', 'speed', 'experimental', 'mood', 'grid'];

export const FILTERS_BACKGROUNDS = {
    rhythm: '/assets/images/rhythm.png',
    speed: '/assets/images/speed.png',
    experimental: '/assets/images/experimental.png',
    mood: '/assets/images/mood.png',
    grid: '/assets/images/grid.png',
    duration: '/assets/images/duration.svg',
};

export const FILTERS_DESCRIPTIONS = {
    rhythm:
        '<strong>Rhythm</strong> refers to the amount of rhythmic content in a piece. Ambient and fully a-rhythmic pieces would be zero. Extremely rhythm-focused pieces would be at the highest numbers.',
    speed:
        '<strong>Speed</strong> is speed. Not just based on BPM but the presence (or lack) of urgency and forward movement. With lots of ambient and downtempo, the PatternBased catalog as a whole is slower than most.',
    experimental:
        'The lower numbers would correspond to the commercial usefulness or sonically straightforwardness of a piece. The highest numbers are generally more unusual from both a sonic/mix and musical standpoint.',
    mood:
        '<strong>Mood</strong> refers to the emotional content. Around zero you would find terror and extreme uncomfort. Lots of more complex emotional content like nostalgia and bittersweet around 3-6. While 7 and above would be uplifting and happy.',
    grid:
        'Lower numbers would correspond to rigid mechanical pieces, straightforward electronic beat-based music. Higher numbers would correspond to looser, more organic human feeling live music.',
    duration: '',
    flow: '',
    instruments: '',
};

export const FLOW_SHAPES = [
    { name: 'flat', image: '/assets/images/flow-flat.png', activeImage: '/assets/images/flow-flat-active.png' },
    {
        name: 'subtleBuild',
        image: '/assets/images/flow-subtle-build.png',
        activeImage: '/assets/images/flow-subtle-build-active.png',
    },
    { name: 'build', image: '/assets/images/flow-build.png', activeImage: '/assets/images/flow-build-active.png' },
    {
        name: 'beat',
        image: '/assets/images/flow-beat.png',
        activeImage: '/assets/images/flow-beat-active.png',
    },
    {
        name: 'multiBuild',
        image: '/assets/images/flow-multiple-build.png',
        activeImage: '/assets/images/flow-multiple-build-active.png',
    },
    {
        name: 'meandering',
        image: '/assets/images/flow-meandering.png',
        activeImage: '/assets/images/flow-meandering-active.png',
    },
];

export const DURATION_VALUES = [
    { name: '0 - 1', value: [0, 1] },
    { name: '1 - 2', value: [1, 2] },
    { name: '2 - 3', value: [2, 3] },
    { name: '3 - 5', value: [3, 5] },
    { name: '5 - 10', value: [5, 10] },
    { name: '10+', value: [10, 500] },
];

export const TABLE_FLOW_SHAPES = [
    { name: 'flat', image: '/assets/images/table/flat.svg' },
    {
        name: 'subtleBuild',
        image: '/assets/images/table/subtleBuild.svg',
    },
    { name: 'build', image: '/assets/images/table/build.svg' },
    {
        name: 'beat',
        image: '/assets/images/table/beat.svg',
    },
    {
        name: 'multiBuild',
        image: '/assets/images/table/multipleBuild.svg',
    },
    {
        name: 'meandering',
        image: '/assets/images/table/meandering.svg',
    },
];

export const PRESETS = {
    'Commerce and Happiness': {
        background: '/assets/images/presets/tim-mossholder-78CGaGIFkzE-unsplash.jpg',
        copyright: 'cc-0 Tim Mossholder unsplash.com',
        filters: {
            rhythm: [3, 10],
            speed: [3, 10],
            mood: [7, 10],
            experimental: [0, 3],
            grid: [0, 10],
        },
    },
    'Horror Drones': {
        background: '/assets/images/presets/simon-matzinger-rydQVdwcgUQ-unsplash.jpg',
        copyright: 'cc-0 Simon Matzinger unsplash.com',
        filters: {
            rhythm: [0, 2],
            speed: [0, 10],
            mood: [0, 1.75],
            experimental: [0, 10],
            grid: [0, 10],
        },
    },
    'Highly Rhythmic': {
        background: '/assets/images/presets/Colony-Modular-Living-Science-Fiction-Construction-1486781.jpg',
        copyright: 'cc-0 Pete Linforth maxpixel.net',
        filters: {
            rhythm: [7.5, 10],
            speed: [0, 10],
            mood: [0, 10],
            experimental: [0, 10],
            grid: [0, 10],
        },
    },
    'Peaceful Ambient': {
        background: '/assets/images/presets/harli-marten-n7a2OJDSZns-unsplash.jpg',
        copyright: 'cc-0 Harli Marten unsplash.com',
        filters: {
            rhythm: [0, 2],
            speed: [0, 10],
            mood: [3.5, 8],
            experimental: [0, 10],
            grid: [3, 10],
        },
    },
    'Highly Electronic': {
        background: '/assets/images/presets/rene-bohmer-YeUVDKZWSZ4-unsplash.jpg',
        copyright: 'cc-0 Rene Bohmer unsplash.com',
        filters: {
            rhythm: [0, 10],
            speed: [0, 10],
            mood: [0, 10],
            experimental: [0, 10],
            grid: [0, 3],
        },
    },
    'Highly Organic': {
        background: '/assets/images/presets/chuttersnap-WaR597MDYso-unsplash.jpg',
        copyright: 'cc-0 Chuttersnap unsplash.com',
        filters: {
            rhythm: [0, 10],
            speed: [0, 10],
            mood: [0, 10],
            experimental: [0, 10],
            grid: [7.5, 10],
        },
    },
    'Dark Technical Rhythms': {
        background: '/assets/images/presets/josh-rose-trYl7JYATH0-unsplash.jpg',
        copyright: 'cc-0 Josh Rose unsplash.com',
        filters: {
            rhythm: [6.5, 10],
            speed: [2.5, 10],
            mood: [0, 4],
            experimental: [0, 10],
            grid: [0, 4],
        },
    },
    'Pure Commerce': {
        background: '/assets/images/presets/chuttersnap-kyCNGGKCvyw-unsplash.jpg',
        copyright: 'cc-0 Chuttersnap unsplash.com',
        filters: {
            rhythm: [0, 10],
            speed: [0, 10],
            mood: [4, 10],
            experimental: [0, 2],
            grid: [0, 10],
        },
    },
    'Organic Melancholy': {
        background: '/assets/images/presets/claus-grunstaudl-XcaAQXrhpLQ-unsplash.jpg',
        copyright: 'cc-0 Claus Grunstaudl unsplash.com',
        filters: {
            rhythm: [0, 7],
            speed: [1, 6],
            mood: [3, 6],
            experimental: [0, 7],
            grid: [6.5, 10],
        },
    },
    'Conspiracy Theories': {
        background: '/assets/images/presets/lisa-vanthournout-jezQ2hqsWHc-unsplash.jpg',
        copyright: 'cc-0 Lisa Vanthournout unsplash.com',
        filters: {
            rhythm: [4.5, 10],
            speed: [3.5, 10],
            mood: [2.5, 5],
            experimental: [0, 10],
            grid: [0, 7.5],
        },
    },
    'Mixed Feelings Ambient': {
        background: '/assets/images/presets/laura-vinck-Hyu76loQLdk-unsplash.jpg',
        copyright: 'cc-0 Laura Vinck unsplash.com',
        filters: {
            rhythm: [0, 2],
            speed: [0, 2],
            mood: [3, 6],
            experimental: [0, 10],
            grid: [2, 10],
        },
    },
    Experimental: {
        background: '/assets/images/presets/jr-korpa-lv4wDoztftk-unsplash.jpg',
        copyright: 'cc-0 Jr Korpa unsplash.com',
        filters: {
            rhythm: [0, 10],
            speed: [0, 10],
            mood: [0, 10],
            experimental: [7.5, 10],
            grid: [0, 10],
        },
    },
    Uplifting: {
        background: '/assets/images/presets/greg-rakozy-oMpAz-DN-9I-unsplash.jpg',
        copyright: 'cc-0 Greg Rakozy unsplash.com',
        filters: {
            rhythm: [0, 10],
            speed: [0, 10],
            mood: [8, 10],
            experimental: [0, 9],
            grid: [0, 10],
        },
    },
    'Chill Beats': {
        background: '/assets/images/presets/hal-gatewood-0lGVcrAFHZQ-unsplash.jpg',
        copyright: 'cc-0 Hal Gatewood unsplash.com',
        filters: {
            rhythm: [3, 7.5],
            speed: [0, 6],
            mood: [3, 7.5],
            experimental: [0, 10],
            grid: [0, 8.5],
        },
    },
    'Grimey Beats': {
        background: '/assets/images/presets/pawel-czerwinski-SOiSsilz3Eg-unsplash.jpg',
        copyright: 'cc-0 Pawel Czerwinski unsplash.com',
        filters: {
            rhythm: [4, 9],
            speed: [3, 10],
            mood: [0, 4],
            experimental: [0, 6],
            grid: [0, 6],
        },
    },
    'Dark Organic Ambient': {
        background: '/assets/images/presets/adrien-olichon-jine2WvZUs8-unsplash.jpg',
        copyright: 'cc-0 Adrien Olichon unsplash.com',
        filters: {
            rhythm: [0, 3],
            speed: [0, 3],
            mood: [2, 4.75],
            experimental: [0, 10],
            grid: [6.5, 10],
        },
    },
};

export const INSTRUMENTS = [
    'Drums',
    'Drum Machine',
    '808 Drums',
    'Drum Loops',
    'Percussion',
    'Sub Bass',
    'Bass',
    'Upright Bass',
    'Piano',
    'Guitar',
    'Synthesizer',
    'Accordion',
    'Banjo',
    'Ukulele',
    'Vocals',
    'Voice',
    'Samples',
    'Strings',
    'Pizzicato Strings',
    'Organ',
    'Drones',
    'Feedback',
    'Field Recordings',
    'Bells',
    'Textures',
    'Analog Synthesizer',
    'Electric Piano',
    'Celeste',
    'Bowed Objects',
    'Found Sounds',
    'Fender Rhodes',
    'Ebowed Guitar',
    'Saxaphone',
    'Trumpet',
    'Electronics',
    'Clarinet',
    'Harp',
    'Zylophone',
    'Vibraphone',
    'Flute',
];

export const ARTISTS = [
    'Joseph Minadeo',
    'Low in the Sky',
    'Insect Sounds',
    'Hill Sleepers',
    'PatternBased',
    'Puffy Shapes',
    'Joseph Minadeo and Curt Brown',
    'Joseph Minadeo and Michael Tolan',
    'Gnosotros',
    'Solver',
];

export const SONGS = [
    'Example 1',
    'Example 2',
    'Example 3',
    'Example 4',
    'Example 5',
    'Example 6',
    'Example 7',
    'Example 8',
    'Example 9',
    'Example 10',
];
