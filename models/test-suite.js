var ingRead = require('./ingredientReader.js');
var fs = require('fs');

//Testing

//Test 1: nothing special about ing flags... 

/*

ingRead.ingToFlags(["nothing", "special", "here", "my", "dude"], function (data) {
	console.log("Should be no true flags: "); 
	console.log(JSON.stringify(data));

	ingRead.ingToFlags(["goobers", "lychee nut", "blarauguguhgh"], function(data) {
		console.log("There should be two true flags; ");
		console.log(JSON.stringify(data));
	});

});

*/

console.log("Should return some big string with random shit");
fs.readFile('../models/bigResponse.json', 'utf8', (err, data) => {
	if (err) throw err; //if there's some problem (which should NEVER happen)

	var bigObject = JSON.parse(data);
	ingRead.jsonToIng(data, function(result) {
		console.log(result);
	});
});