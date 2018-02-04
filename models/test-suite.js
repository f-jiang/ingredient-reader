var ingRead = require('./ingredientReader.js');

//Testing

//Test 1: nothing special about ing flags... 
ingRead.ingToFlags(["nothing", "special", "here", "my", "dude"], function (data) {
	console.log("Should be no true flags: "); 
	console.log(JSON.stringify(data));

	ingRead.ingToFlags(["goobers", "lychee nut", "blarauguguhgh"], function(data) {
		console.log("There should be two true flags; ");
		console.log(JSON.stringify(data));
	});

});

