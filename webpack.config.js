const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const root = path.resolve(__dirname, './src/client/');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = (env = 'production') => {
    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            templateParameters: {
                env,
            },
        }),
    ];

    if (env === 'development') {
        plugins.push(new LiveReloadPlugin());
        plugins.push(new Dotenv());
    } else {
        require('dotenv').config();
        const envPlugin = new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                SQUARE_APP_ID: JSON.stringify(process.env.SQUARE_APP_ID),
                SQUARE_LOCATION_ID: JSON.stringify(process.env.SQUARE_LOCATION_ID),
                SQUARE_ACCESS_TOKEN: JSON.stringify(process.env.SQUARE_ACCESS_TOKEN),
                AWS_SECRET_ACCESS_KEY: JSON.stringify(process.env.AWS_SECRET_ACCESS_KEY),
                AWS_ACCESS_KEY_ID: JSON.stringify(process.env.AWS_ACCESS_KEY_ID),
                AWS_REGION: JSON.stringify(process.env.AWS_REGION),
            },
        });
        plugins.push(envPlugin);
    }

    return {
        context: root,

        entry: {
            app: root,
        },

        output: {
            filename: '[name].bundle.[chunkhash].js',
            publicPath: '/',
        },

        resolve: {
            modules: [root, 'node_modules'],
            extensions: ['.js', '.jsx'],
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [postcssPresetEnv()],
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: 'react-svg-loader',
                            options: {
                                jsx: true, // true outputs JSX tags
                            },
                        },
                    ],
                },
            ],
        },

        plugins,
    };
};
