//Modules
var fs = require('fs');

// function ingredients takes in a javascript object, which is a list of ingredients. 
// As of present, we have THREE flags: 
//     - peanuts
// 	   - tree nuts
//     - wheat

function ingToFlags(ingredients, callback) {
	var ingLength = ingredients.length;

	fs.readFile('file', 'utf8', (err, data) => {
		if (err) throw err; //if there's some problem (which should NEVER happen)
		
		listFlags = JSON.parse(data); //My flag list ... 

		var objOutFlags; //output

		//INGREDIENT CHECK LOOP
		//For each flag, check if each ingredient in the flag is in the ingredients 
		for each (flag in listFlags) {
			var present = false; 

			var flagLength = flag.length; 
			//For each ingredient in the flag
			for (int i = 0; i < flagLength; i++) {

				//For each ingredient in ingredients
				for (int j = 0; j < ingLength; j++) {
					var compareIng = ingredients[i].toLowerCase();

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
}