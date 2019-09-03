const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const root = path.resolve(__dirname, './src/client/');

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
