'use strict';

var Yelp = require('yelp');
var fs = require('fs');
var express = require('express');
var http = require('http').Server(app);
var app = express();

let yelp = new Yelp({
  consumer_key: 'dCp404BfNoNA2l6QxR7vfA',
  consumer_secret: 'cMCWXtscKzk2sNsL6dAdQMnHbGI',
  token: 'fs-z0_Bn_WLGrBGLaCvPpEx0ggBcnvSF',
  token_secret: '0aFLarlnNMWLVESTKiZ0laU3rVQ',
});

app.use(express.static('public'));

app.listen(80, function() {
    console.log("App listening on port 80");
});

app.get('/yelp', function(request, response){

    //setting default variables
    let location = request.query.location || "Toronto";
    let offset = request.query.offset || 0;
    let callCount = request.query.callCount || 5;
    let saveFile = request.query.saveFile || 1;

    let grabs = [];
    let allData = {};
    let allDataF = {};


    for (let i = 0; i <= (callCount*20); i +=20) {
        console.log(`making Yelp API request with offset ${i}`)
        grabs.push(grabYelpData(location, i));
    }

    Promise.all(grabs).then(function(values) {
        allData = values[0];
        let fullList = [];
        let valuesList = [];
        let newAllData = [];

        for (var i = 0; i <= callCount; i++) {
            valuesList.push(values[i].businesses);
        }

        if (!(values[0].hasOwnProperty('data')))  {
            fullList = [].concat.apply([], valuesList);
            allData.businesses = fullList;
        } else {
            return;
        }

        response.json(allData);

        if (saveFile == 1) {
            console.log("Starting write to file");
            saveFile(allData, "data.json");
        }
    });
});

function grabYelpData(loc, offset) {
    return new Promise(function(resolve, reject){
        yelp.search({ term: 'food', location: loc, limit: '20', offset: '20'})
        .then((data) => {
            resolve(data);
        })
        .catch((err) => {
            console.error(err);
            reject(JSON.parse(err));
        });
    });
}

function saveFile(data, fileName) {
    console.log("Starting write to file");

    fs.writeFile(fileName, JSON.stringify(data, null, " "), (err) => {
        if (err) console.log(err);
        console.log("File Saved: " + fileName);
    });
}
