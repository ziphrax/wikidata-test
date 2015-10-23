var express = require('express');
var app = express();
var wiki = require('wikidata-sdk');
var request = require('request');
var engine = require('ejs-locals');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10});

app.engine('ejs', engine);
app.set('view engine','ejs');

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public',express.static('public_assets'));
app.use('/public/libs',express.static('bower_components'));

app.get('/',function(req,res){
    res.render('index');
});

app.get('/data',function(req,res){
    getData(req,function(data){
        res.json(data);
    });
});

app.get('/data/:query',function(req,res){
    var cacheKey = 'dataquery:'+JSON.stringify(req.params.query);
    var ttl = 30;
    memoryCache.wrap(cacheKey, function(cacheCallback) {
        getData(req,cacheCallback);
    }, {ttl: ttl}, function(err,result){
        res.json(result);
    });
});

app.listen(3000,function(){
    console.log('wikidata test has started on port 3000');
});

function getData(req,callback){
    var search = req.params.query
    var languages = 'en';
    var limit = 10;
    var format = 'json';
    var url = wiki.searchEntities(search, languages,limit,format);
    request(url,function(error,response,body){
        if(error){
            console.log(error);
        } else {
            var bodyObj = JSON.parse( body );
            callback(null,bodyObj);
        }
    });
}
