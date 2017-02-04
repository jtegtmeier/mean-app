'use strict';

let express = require('express');
var mongoose = require('mongoose');

let app = express();
mongoose.connect('mongodb://mean-app:supercool@ds117909.mlab.com:17909/mean-app-database');

let linkSchema = new mongoose.Schema(
    {id: Number, title: String, category: String, url: String},
    {collection: 'Links'}
)

let Link = mongoose.model('Link', linkSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connected!");
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html', function(err){
        if(err){
            console.log(err);
            res.status(err.status).end();
        }
        else{
            console.log('Sent:', 'index.html');
        }
  });
});

app.get('/public/:name', function(req, res){
    res.sendFile(__dirname + '/public/'+ req.params.name, function(err){
        if(err){
            console.log(err);
            res.status(err.status).end();
        }
        else{
            console.log('Sent:', req.params.name);
        }
  });
});

app.get('/public/:filetype/:name', function(req, res){
    res.sendFile(__dirname + '/public/' + req.params.filetype + '/' + req.params.name, function(err){
        if(err){
            console.log(err);
            res.status(err.status).end();
        }
        else{
            console.log('Sent:', req.params.name);
        }
  });
});

app.get('/data/:name', function(req, res){
    if(req.params.name == "links"){
        Link.find(function(err, links){
            if(err) return console.error(err);
            res.json(links);
        });
    }
    
    if(req.params.name == "categories"){
        Link.find().distinct("category", function(err, categories){
            if(err) return console.error(err);
            res.json(categories);
        });
    }
});

app.listen(8080);
