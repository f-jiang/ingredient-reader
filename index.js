const express = require('express')
const ingReader = require('./models/ingredientReader.js')

const app = express()

app.post('/imageToFlags', function(req, res) {
  console.log('image to flags request');
  res.send('image to flags request');
});

app.post('/imageToIngredients', function(req, res) {
  console.log('image to ingredients request');
  res.send('image to ingredients request');
});

app.get('/ingredientsToFlags', function(req, res) {
  console.log('ingredients to flags request');
  res.send('ingredients to flags request');
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

