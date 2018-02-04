//Modules
var fs = require('fs');

module.exports = {

	// function ingredients takes in a javascript object, which is a list of ingredients. 
	// As of present, we have THREE flags: 
	//     - peanuts
	// 	   - tree nuts
	//     - wheat
	ingToFlags: function(ingredients, callback) {
		var ingLength = ingredients.length;

		fs.readFile('../data/flags.json', 'utf8', (err, data) => {
			if (err) throw err; //if there's some problem (which should NEVER happen)
			
			objFlags = data; //My flag list ... 

			var objOutFlags = {}; //output

			//INGREDIENT CHECK LOOP
			//For each flag, check if each ingredient in the flag is in the ingredients 
			for (flag in objFlags) {
				var present = false; 

				var flagLength = flag.length; 
				//For each ingredient in the flag
				for (var i = 0; i < flagLength; i++) {

					//For each ingredient in ingredients
					for (var j = 0; j < ingLength; j++) {
						var compareIng = ingredients[j].toLowerCase();

						//If we find a matching ingredient... 
						if (compareIng.startsWith(flag[i])) {
							present = true;
							break; 
						}
						if (present) break;
					}
					if (present) break;
				}
				//Outputs json
				objOutFlags[flag] = present; 
			}

			callback(objOutFlags); //Asynchronous
			return objOutFlags; //Synchronous

		});
	},

	//Function that takes in the raw json file returned by Microsoft's ORC. 
	//(attempts to) identify ingredients, and returns an array of them. 
	jsonToIng: function(bigObj, callback) {
		var strStart = "ingredients";
		var start = false;
		var end = false; 

		var arrEndings;
		var arrIngredients; 
		fs.readFile('../data/endwords.json', 'utf8', (err, data) => {
			arrEndings = data; 

			var index = 0;
			//HUGE LOOP for collected data bigObj
			for (region in bigObj.regions) {
				for (line in region.lines) {
					for (word in lines.words) {

						//If the 'ingredients' hasn't started yet ... 
						if (!start) {
							if (strStart == word.text.toLowerCase()) {
								start = true;
							}
						}
						//If it's already ended, then we stop reading alltogether
						else if (end) {
							break; 
						}
						else {
							//First let's check if it matches anything in the endwords list
							var lenArrEndings = arrEndings.length; 

							for (var i = 0; i < lenArrEndings; i++) {
								if (arrEndings[i] == word.text.toLowerCase()) {
									end = true;
									break;
								}
							}

							//Add to the ingredients array if it hasn't ended... 
							if (!end) {
								arrIngredients[index] = word.text; 
								index++;
							}
						}
					}
				}
			}

			//Return the output ... 
			callback(arrIngredients);

		});

	},

	//Function jsonToFlags combines the previous two functions in serial ... 
	jsonToFlags: function(objBig, callback) {
		//First function call ...
		jsonToIng(objBig, (data) => {
			//Second function call ... 
			ingToFlags(data, (flags) => {
				//Callback
				callback(flags);
			})
		})
	}

}
