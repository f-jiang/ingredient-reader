const express = require('express');
const ingReader = require('./models/ingredientReader.js');
const request = require('request');
const querystring = require('querystring');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

const subscriptionKey = process.env.API_KEY;

var getOcrResults = function(imgUrl, callback) {
  request.post({
    // TODO add a params object and build the query string separately
    url: 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=unk&detectOrientation=true',
    body: "{'url': '" + imgUrl + "'}",
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  }, callback);
};

app.get('/imageToFlags', function(req, res) {
  if (req.query.imgUrl) {
    getOcrResults(req.query.imgUrl, function(error, response, body) {
      var ocrResults = JSON.parse(body);
      ingReader.jsonToFlags(ocrResults, function(flags) {
        res.send(JSON.stringify(flags));
      });
    });
  }
});

app.get('/imageToIngredients', function(req, res) {
  if (req.query.imgUrl) {
    getOcrResults(req.query.imgUrl, function(error, response, body) {
      var ocrResults = JSON.parse(body);
      ingReader.jsonToIng(ocrResults, function(ingredients) {
        res.send(JSON.stringify(ingredients));
      });
    });
  }
});

app.get('/ingredientsToFlags', function(req, res) {
  if (req.query.ingredients) {
    ingReader.ingToFlags(req.query.ingredients, function(flags) {
      res.send(JSON.stringify(flags));
    });
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

