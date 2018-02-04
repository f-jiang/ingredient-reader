var ingRead = require('./ingredientReader.js');

//Testing

//Test 1: nothing special about ing flags... 
ingRead.ingToFlags(["nothing", "special", "here", "my", "dude"], function (data) {
	console.log("Should be no true flags: "); 
	console.log(JSON.stringify(data));



});

