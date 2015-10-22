var express = require('express');
var app = express();
var wiki = require('wikidata-sdk');
var request = require('request');
var engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('view engine','ejs');

app.use('/public',express.static('public_assets'));
app.use('/public/libs',express.static('bower_components'));

app.get('/',function(req,res){
    var search = "Britain"
    var languages = 'en'
    var limit = 20;
    var format = 'json';
    var url = wiki.searchEntities(search, languages,limit,format);
    request(url,function(error,response,body){
        console.log(url);
        if(error){
            console.log(error);
        } else {
            var bodyObj = JSON.parse( body );
            console.log(bodyObj);
            res.render('index' , { rc: bodyObj } );
        }
    });
});

app.listen(3000,function(){
    console.log('wikidata test has started on port 3000');
});
