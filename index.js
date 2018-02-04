const express = require('express');
const ingReader = require('./models/ingredientReader.js');
const request = require('request');
const querystring = require('querystring');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

const subscriptionKey = process.env.API_KEY;

app.get('/imageToFlags', function(req, res) {
  console.log(res);
  res.send('image to flags request');
});

app.get('/imageToIngredients', function(req, res) {
  if (req.query.imgUrl) {
    var imgUrl = req.query.imgUrl;

    request.post({
      // TODO add a params object and build the query string separately
      url: 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/ocr?language=unk&detectOrientation=true',
      body: "{'url': '" + imgUrl + "'}",
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    }, function(error, response, body) {
      res.send(JSON.parse(body));
    });
  }
});

app.get('/ingredientsToFlags', function(req, res) {
  console.log('ingredients to flags request');
  res.send('ingredients to flags request');
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

