const express = require('express');
const ingReader = require('./models/ingredientReader.js');
const request = require('request');
const querystring = require('querystring');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

/*
 * Keep the MS Azure API key private by putting its definition in a file untracked by Git. The file is then
 * sourced so as to be accessible in code via process.env.API_KEY.
 */
const subscriptionKey = process.env.API_KEY;

/*
 * Process the image specified by imgUrl with the Azure OCR engine and return the detected words in a
 * JSON object which organizes the words in terms of line and coordinate position.
 *
 * callback - a function whose one parameter is used to store the JSON object returned by the Azure API call
 */
var getOcrResults = function(imgUrl, callback) {
  var params = {
    'language': 'unk',
    'detectOrientation': true
  };
  var qstr = querystring.stringify(params);

  request.post({
    url: `https://eastus.api.cognitive.microsoft.com/vision/v1.0/ocr?${qstr}`,
    body: `{'url': '${imgUrl}'}`,
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  }, callback);
};

/*
 * API endpoint that accepts an image URL and returns an object that specifies the "edibility" of
 * the ingredients list found in the image provided. The object follows the below format:
 *
 * {
 *   'peanuts': false,
 *   'tree nuts': false,
 *   'wheat': true
 * }
 */
app.get('/imageToFlags', (req, res) => {
  if (req.query.imgUrl) {
    getOcrResults(req.query.imgUrl, (error, response, body) => {
      var ocrResults = JSON.parse(body);
      ingReader.jsonToFlags(ocrResults, flags => {
        res.send(JSON.stringify(flags));
      });
    });
  }
});

/*
 * API endpoint that accepts an image URL and returns a string array containing the ingredients
 * found in the image by the Azure OCR engine.
 */
app.get('/imageToIngredients', (req, res) => {
  if (req.query.imgUrl) {
    getOcrResults(req.query.imgUrl, (error, response, body) => {
      var ocrResults = JSON.parse(body);
      ingReader.jsonToIng(ocrResults, ingredients => {
        res.send(JSON.stringify(ingredients));
      });
    });
  }
});

/*
 * API endpoint that accepts a list of ingredients and returns a string array containing
 * the allergens found within the ingredients list.
 */
app.get('/ingredientsToFlags', (req, res) => {
  if (req.query.ingredients) {
    ingReader.ingToFlags(req.query.ingredients, flags => {
      res.send(JSON.stringify(flags));
    });
  }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});

