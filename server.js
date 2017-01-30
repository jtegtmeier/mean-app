'use strict';

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const IPaddress = isDeveloping ? process.env.IP : process.env.IP;
const port = isDeveloping ? 8080 : process.env.PORT;
const app = express();
const mlabDB = mongoose;

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
let db = mlabDB.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected!");
});

//setup webpack and express server
//or run production server
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
    app.get('/', (req, res) => {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });
}
else {
    app.use(express.static(__dirname + '/dist'));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
}

//routes for database queries
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
app.listen(port, IPaddress, function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('Listening on port %s. Open up http://%s:%s/ in your browser.', port, IPaddress, port);
});
