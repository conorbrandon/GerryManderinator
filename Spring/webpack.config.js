var path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        new Dotenv(),
    ],
    entry: './src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: true,
    mode: 'development',
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.geojson$/,
                loader: 'json-loader'
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'url-loader'
            },
            {
                test: /\.css$/,
                //loader: 'css-loader'
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/, //path.join(__dirname, '.'),
                exclude: [
                    path.resolve('./', 'node_modules/'),
                //     path.resolve('./', 'src/main/js/assets/'),
                //     path.resolve('./', 'src/main/js/icons/')
                ],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            '@babel/plugin-proposal-nullish-coalescing-operator',
                            '@babel/plugin-proposal-optional-chaining',
                        ],
                    }
                }]
            }
        ]
    }
};