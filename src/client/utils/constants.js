export const HEADER_HEIGHTS = {
    small: 60,
    big: 80,
};

export const INITIAL_FILTER_VALUES = {
    rhythm: [0, 10],
    speed: [0, 10],
    experimental: [0, 10],
    mood: [0, 10],
    grid: [0, 10],
    duration: [0, 20],
    flow: [],
    instruments: [],
    search: [],
};

export const BASIC_FILTERS = ['rhythm', 'speed', 'experimental', 'mood', 'grid', 'duration'];

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
        name: 'descending',
        image: '/assets/images/flow-descending.png',
        activeImage: '/assets/images/flow-descending-active.png',
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

export const TABLE_FLOW_SHAPES = [
    { name: 'flat', image: '/assets/images/table/flat.svg' },
    {
        name: 'subtleBuild',
        image: '/assets/images/table/subtleBuild.svg',
    },
    { name: 'build', image: '/assets/images/table/build.svg' },
    {
        name: 'descending',
        image: '/assets/images/table/descending.svg',
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
            mood: [0, 3],
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
            mood: [0, 10],
            experimental: [0, 4],
            grid: [0, 10],
        },
    },
    'Pure Commerce': {
        background: '/assets/images/presets/chuttersnap-kyCNGGKCvyw-unsplash.jpg',
        copyright: 'cc-0 Chuttersnap unsplash.com',
        filters: {
            rhythm: [0, 10],
            speed: [0, 10],
            mood: [4, 10],
            experimental: [0, 3],
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
            mood: [2.5, 6],
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
            speed: [3, 9],
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
            mood: [2.5, 5],
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
