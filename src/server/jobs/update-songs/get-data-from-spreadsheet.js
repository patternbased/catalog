/* eslint-disable quote-props */

const config = require('../../config');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const AWS = require('aws-sdk');

const spreadsheetConfig = config.googleSpreadsheets.songs;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});
AWS.config.mediaconvert = { endpoint: 'https://vasjpylpa.mediaconvert.us-east-1.amazonaws.com' };
let params = {
    Queue: 'arn:aws:mediaconvert:us-east-1:541820445726:queues/Default',
    UserMetadata: {},
    Role: 'arn:aws:iam::541820445726:role/service-role/MediaConvert_Default_Role',
    Settings: {
        TimecodeConfig: {
            Source: 'ZEROBASED',
        },
        OutputGroups: [
            {
                CustomName: 'converted',
                Name: 'Apple HLS',
                Outputs: [
                    {
                        ContainerSettings: {
                            Container: 'M3U8',
                            M3u8Settings: {
                                AudioFramesPerPes: 4,
                                PcrControl: 'PCR_EVERY_PES_PACKET',
                                PmtPid: 480,
                                PrivateMetadataPid: 503,
                                ProgramNumber: 1,
                                PatInterval: 0,
                                PmtInterval: 0,
                                Scte35Source: 'NONE',
                                NielsenId3: 'NONE',
                                TimedMetadata: 'NONE',
                                VideoPid: 481,
                                AudioPids: [482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492],
                            },
                        },
                        AudioDescriptions: [
                            {
                                AudioTypeControl: 'FOLLOW_INPUT',
                                AudioSourceName: 'Audio Selector 1',
                                CodecSettings: {
                                    Codec: 'AAC',
                                    AacSettings: {
                                        AudioDescriptionBroadcasterMix: 'BROADCASTER_MIXED_AD',
                                        Bitrate: 96000,
                                        RateControlMode: 'CBR',
                                        CodecProfile: 'LC',
                                        CodingMode: 'CODING_MODE_2_0',
                                        RawFormat: 'NONE',
                                        SampleRate: 48000,
                                        Specification: 'MPEG4',
                                    },
                                },
                                LanguageCodeControl: 'FOLLOW_INPUT',
                            },
                        ],
                        OutputSettings: {
                            HlsSettings: {
                                AudioGroupId: 'program_audio',
                                AudioTrackType: 'AUDIO_ONLY_VARIANT_STREAM',
                                SegmentModifier: 'songfile',
                                AudioOnlyContainer: 'AUTOMATIC',
                                IFrameOnlyManifest: 'EXCLUDE',
                            },
                        },
                        NameModifier: 'songlist',
                    },
                ],
                OutputGroupSettings: {
                    Type: 'HLS_GROUP_SETTINGS',
                    HlsGroupSettings: {
                        ManifestDurationFormat: 'INTEGER',
                        SegmentLength: 10,
                        TimedMetadataId3Period: 10,
                        CaptionLanguageSetting: 'OMIT',
                        Destination: 's3://pblibrary/converted/',
                        TimedMetadataId3Frame: 'PRIV',
                        CodecSpecification: 'RFC_4281',
                        OutputSelection: 'MANIFESTS_AND_SEGMENTS',
                        ProgramDateTimePeriod: 600,
                        MinSegmentLength: 0,
                        MinFinalSegmentLength: 0,
                        DirectoryStructure: 'SINGLE_DIRECTORY',
                        ProgramDateTime: 'EXCLUDE',
                        SegmentControl: 'SEGMENTED_FILES',
                        ManifestCompression: 'NONE',
                        ClientCache: 'ENABLED',
                        StreamInfResolution: 'INCLUDE',
                    },
                },
            },
        ],
        AdAvailOffset: 0,
        Inputs: [
            {
                AudioSelectors: {
                    'Audio Selector 1': {
                        Offset: 0,
                        DefaultSelection: 'DEFAULT',
                        SelectorType: 'LANGUAGE_CODE',
                        ProgramSelection: 1,
                        LanguageCode: 'ENG',
                    },
                },
                FilterEnable: 'AUTO',
                PsiControl: 'USE_PSI',
                FilterStrength: 0,
                DeblockFilter: 'DISABLED',
                DenoiseFilter: 'DISABLED',
                TimecodeSource: 'ZEROBASED',
                FileInput: 's3://pblibrary/PB04/PB0401.mp3',
            },
        ],
    },
    AccelerationSettings: {
        Mode: 'DISABLED',
    },
    StatusUpdateInterval: 'SECONDS_60',
    Priority: 0,
};

/**
 * Get all the data from the symbols spreadsheet
 * @returns {Promise}
 */
module.exports = async () => {
    const doc = new GoogleSpreadsheet(spreadsheetConfig.spreadsheetId);
    await doc.useServiceAccountAuth({
        client_email: 'import-songs-spreadsheet@pb-library.iam.gserviceaccount.com',
        private_key:
            '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC88/IkjO5EH5CM\ndJi6l9uqvF+gabUwhOi3BnsuVXVpBtNt+l5XMm6hKn2l1rjitrU9trVTO2kTDgY4\nR2hqoIpcPECZmHVzOqnLElisgkKZFOf8rsAxd7PuRz+94yWIwgvBtFR4n9wWjJew\n6uyJMiEb8sx36q0hQEDFXDv8rwuI1ZLlz/ndEBVEvy8M1uCR4v8ZmWK4ed/iJAbA\nuBDU1g1Q/uQUQuApMBZRTbuGlPhLJta21KhSfFa2igxCBtdUoPomEhEpV5VBXzaS\nOx/3j8DhHVPq31LxdgxTI8ars6/jNxMHXp4CP8dSwEk1niBtqla1W6Xtyvvb38Ix\ndmjGS+unAgMBAAECggEACoDY9fUrjXffth8JGl40pMIB4s3dd4v7z6i5kjLH6wWp\nHRTsx5YTFjxhbaWI83lKi9qrK6xCw/9kkx5NDJhN+KCUyrTx2mzpYVNswHIhN5c0\n6hPgtR89TkKBpZGJ1ZdLxgG7LFVei5ZXHEuCyIGT25TcjtHpu85xi0b8QqiMUJfO\nBVwC2R8nPXIr5yDiWHK3E8BUQL8GjgnIWI6sSo3gii2HSBgkwwey3J8emZpdi7Dr\nBNzKNduvICguvl57OUnsxVadKwTqNsc790E5B9l6B1hL5hjESycKhtpZTY8sZfjE\nNYMagzZ/Nx/ai0W6GfirWOkys4mlgp0yJ+61jktXGQKBgQD5IBC2anUJi6QL870C\n4JZwkvBlQ+wH/qwEtZfqFaNLmigFIJ+OqqauZ7T3MtlsVG9ScBmmqYsPokuK3c4W\np7Xb2hdFymM42fM5QdvGlXickcgUhK2HKZOwCkOndsrKccBRc5FM6LjM8q3L3WBl\nKZ2+DRdNSwCgvqIZa184GHNQFQKBgQDCKsuv3h8Pnb3KrNPFkOZGQP4Ewh1RLFEe\n5rk2wLt/uaU6DOfp5smkUt16I71LB1az3Z4MpaWqmFVZyiuR9f2YexrffpIsyAOV\nav4AsfQnsgq+ElBEO3UuQ50kV80kU4Q8UpFfja+QpJUT7Z6uJW1Ekk3KNrAkJLXX\nEug23N1/ywKBgBRLi3EA7TXw3VVn7t78IuVa4yCszt673ZGopY6ZYqs3DMmWJcl+\nl4OfyTtWNiZAHq2NmllceIq2gwb2GOL5mLQnaTvzR/AKuWjRt7DO3nuK2MzrHiPj\nvDdcLrTG1bB2Yd+A1bZ5QwzXPFdeWosDP+mKsXpHgO6XeScu+xvbyhEdAoGADlz8\nFFZqFc2lbIi8YbEGV8wW/mMdqBOPLKoEqXg4ZoplHpY10aew4ub+WzqplhNE5qlO\nN8FJMAV0yt+ZuYJo8A6rPj0uswFYwoTXpVWEqisRgF36chGz6Wg3B6k3E6jZ71xs\nRJVGl3yVSpQZWOiL3La16m+BOCs/CFnts6FDAWECgYAgfNd3Jx2Dvjjg9O3FmaBp\n1va9cOeYQryG4xq+lU4rhD/MpCxYTEEMSy38WhqDYdICY425RgtA8RPXg9b626Bx\nZWo8L2A91nCnqB3PlgpS/NeuKwU1mpG33IZFTKAK4JFCXu45QTHH5xG7AXZV2Sci\n7M7x3dXnMFiqe5eSaDKpRg==\n-----END PRIVATE KEY-----\n',
    });

    await doc.loadInfo();
    const songsSheet = doc.sheetsByTitle['Songs'];
    const albumsSheet = doc.sheetsByTitle['Albums'];
    const allArtistsSheet = doc.sheetsByTitle['Artists'];
    const featArtistsSheet = doc.sheetsByTitle['FeatArtists'];

    const rows = await songsSheet.getRows({ offset: 2, limit: songsSheet.rowCount });
    const albums = await albumsSheet.getRows({ offset: 1, limit: albumsSheet.rowCount });
    let visualArtists = await allArtistsSheet.getRows({ offset: 2, limit: allArtistsSheet.rowCount });
    const featArtists = await featArtistsSheet.getRows({ offset: 1, limit: featArtistsSheet.rowCount });
    visualArtists = visualArtists.filter((a) => a.type === 'V');

    var separators = [', ', '; ', ',', ';'];

    return rows.map(async (row, index) => {
        const songArt = albums.find((a) => a.AlbumID === row.CatNum);
        const coverArt = [];
        if (songArt) {
            const albumArtArray = songArt.AlbumArt.split(';');
            albumArtArray.map((art) => {
                const found = visualArtists.find((v) => v.ArtistName.toLowerCase().trim() === art.toLowerCase().trim());
                if (found) {
                    coverArt.push({
                        name: art,
                        url: found.URL,
                    });
                }
            });
        }
        const featArts = [];
        if (row.FeatArtist) {
            const allArtists = row.FeatArtist.split(new RegExp(separators.join('|'), 'g'));
            for (var i = 0; i < allArtists.length; i++) {
                const found = featArtists.find(
                    (v) => v.ArtistName.toLowerCase().trim() === allArtists[i].toLowerCase().trim()
                );
                if (found) {
                    featArts.push({
                        name: found.ArtistName,
                        url: found.URL,
                    });
                }
            }
        }

        if (row.Converted !== 'Y') {
            setTimeout(async function () {
                params.Settings.Inputs[0].FileInput = `s3://pblibrary/${row.CatNum}/${row.ID}.mp3`;
                var endpointPromise = new AWS.MediaConvert({ apiVersion: '2017-08-29' }).createJob(params).promise();
                await endpointPromise.then(
                    async function (data) {
                        console.log('Success', index);
                        row.Converted = 'Y';
                        await row.save();
                    },
                    async function (err) {
                        console.log('Error', err);
                        row.Converted = 'N';
                        await row.save();
                    }
                );
            }, index * 1000);
        }
        return {
            pbId: row.ID,
            title: row.Title,
            sequence: row.Seq,
            rate: row.Rate,
            length: row.Length,
            musicKey: row.musicKey,
            bpm: row.BPM,
            rhythm: row.PBRhythm,
            speed: row.PBSpeed,
            mood: row.PBMood,
            experimental: row.PBExperimental,
            grid: row.PBOrganic,
            stems: row.Stems,
            description: row.Description,
            genre: row.Genre,
            subgenreA: row.SubGenreA,
            subgenreB: row.SubGenreB,
            primaryMood: row.PrimaryMood,
            secondaryMoods: row.SecondaryMoods ? row.SecondaryMoods.split(new RegExp(separators.join('|'), 'g')) : [],
            instruments: row.Instruments ? row.Instruments.split(new RegExp(separators.join('|'), 'g')) : [],
            tags: row.Tags ? row.Tags.split(new RegExp(separators.join('|'), 'g')) : [],
            arc: row.ShapeArc,
            similarTracks: row.SimilarPBTracks ? row.SimilarPBTracks.split(new RegExp(separators.join('|'), 'g')) : [],
            similarArtists: row.SimilarArtists ? row.SimilarArtists.split(new RegExp(separators.join('|'), 'g')) : [],
            licenseType: row.LicenseType,
            artistName: row.ArtistName,
            featArtist: featArts,
            writers: row.Writers ? row.Writers.split(new RegExp(separators.join('|'), 'g')) : [],
            label: row.Label,
            albumId: row.CatNum === 'PBL01' || row.CatNum === '' ? 'PBC01' : row.CatNum,
            albumTitle: row.AlbumTitle,
            licensedTo: row.LicensedTo,
            dateStarted: row.DateStarted,
            dateFinished: row.DateFinished,
            dateReleased: row.DateReleased ? row.DateReleased.split(';')[0] : '',
            tools: row.Tools ? row.Tools.split(new RegExp(separators.join('|'), 'g')) : [],
            story: row.Story,
            isrcCode: row.ISRCCode,
            url: `https://pblibrary.s3.us-east-2.amazonaws.com/${row.CatNum}/${row.ID}.mp3`,
            image: ['PB26', 'PB36', 'PB37'].includes(row.CatNum)
                ? `https://pblibrary.s3.us-east-2.amazonaws.com/${row.CatNum}/${row.ID}.jpg`
                : `https://pblibrary.s3.us-east-2.amazonaws.com/${row.CatNum}/cover.jpg`,
            cover: ['PB26', 'PB36', 'PB37'].includes(row.CatNum)
                ? `https://pblibrary.s3.us-east-2.amazonaws.com/${row.CatNum}/${row.ID}_thumb.jpg`
                : `https://pblibrary.s3.us-east-2.amazonaws.com/${row.CatNum}/cover-thumb.jpg`,
            coverArt: coverArt,
            bandcamp: row.BandcampURL,
            soundcloud: row.SoundcloudURL,
            spotify: row.SpotifyURL,
            appleMusic: row.AppleMusicURL,
            deezer: row.DeezerURL,
            vimeo: row.VimeoURL,
            tidal: row.TidalURL,
            youtube: row.YouTubeURL,
            convertedUrl: `https://pblibrary.s3.us-east-2.amazonaws.com/converted/${row.ID}songlist.m3u8`,
        };
    });
};
