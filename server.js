'use strict';

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const mlabDB = mongoose();

//setup mongoDB database object and connect to mlab
mlabDB.connect('mongodb://mean-app:supercool@ds117909.mlab.com:17909/mean-app-database');
let linkSchema = new mlabDB.Schema({
    id: Number,
    title: String,
    category: String,
    url: String
}, {
    collection: 'Links'
})
let Link = mlabDB.model('Link', linkSchema);

var db = mlabDB.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected!");
});

//setup webpack and express server
if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('*', (req, res) => {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });
    app.get('/js/:name', (req, res) => {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/js/:name')));
        res.end();
    });
    app.get('/css/:name', (req, res) => {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/css/:name')));
        res.end();
    });
}
else {
    app.use(express.static(__dirname + '/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    app.get('/js/:name', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/js/:name'));
    });
    app.get('/css/:name', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/css/:name'));
    });
}

//database routes for express
app.get('/linkdata/', (req, res) => {
    if (req.query.q == "links") {
        Link.find(function(err, links) {
            if (err) return console.error(err);
            res.json(links);
        });
    }

    if (req.query.q == "categories") {
        Link.find().distinct("category", function(err, categories) {
            if (err) return console.error(err);
            res.json(categories);
        });
    }
});

//start express
app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
