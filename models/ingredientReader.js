//Modules
var fs = require('fs');

// function ingredients takes in a javascript object, which is a list of ingredients. 
// As of present, we have THREE flags: 
//     - peanuts
//     - tree nuts
//     - wheat
var ingToFlags = function(ingredients, callback) {
  var ingLength = ingredients.length;

  fs.readFile('data/flags.json', 'utf8', (err, data) => {
    if (err) throw err; //if there's some problem (which should NEVER happen)

  objFlags = JSON.parse(data); //My flag list ... 

  var objOutFlags = {}; //output

  //console.log(JSON.stringify(objFlags)); //DEBUGGING

  //INGREDIENT CHECK LOOP
  //For each flag, check if each ingredient in the flag is in the ingredients 
  for (flag in objFlags) {
    var present = false; 

    //console.log("variable flag: "); //DEBUGGING
    //console.log(flag);

    var flagLength = objFlags[flag].length; 
    //For each ingredient in the flag
    for (var i = 0; i < flagLength; i++) {

      //console.log(flag[i]);

      //For each ingredient in ingredients
      for (var j = 0; j < ingLength; j++) {
        var compareIng = ingredients[j].toLowerCase();

        //If we find a matching ingredient... 
        if (compareIng.startsWith(objFlags[flag][i])) {

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

//Function that takes in the raw json file returned by Microsoft's ORC. 
//(attempts to) identify ingredients, and returns an array of them. 
var jsonToIng = function(bigObj, callback) {

  //console.log(bigObj);

  var strStart = "ingredients:";
  var start = false;
  var end = false; 

  var arrEndings;
  var arrIngredients = []; 
  fs.readFile('data/endwords.json', 'utf8', (err, data) => {
    if (err) throw err; //if there's some problem (which should NEVER happen)
    arrEndings = JSON.parse(data); 
    console.log(bigObj);

      var regLength = bigObj["regions"].length;

    for (var i = 0; i < regLength; i++) {

      //console.log(bigObj["regions"][i]); //DEBUGGING

      var lineLength = bigObj["regions"][i]["lines"].length;
      //console.log("ELEMENTS IN A LINE: "); //DEBUGGING
      //console.log(lineLength);
      for (var j = 0; j < lineLength; j++) {

        //console.log(bigObj["regions"][i]["lines"][j]); //DEBUGGING

        var wordLength = bigObj["regions"][i]["lines"][j]["words"].length;
        for (var k = 0; k < wordLength; k++) {

          //console.log(bigObj["regions"][i]["lines"][j].words[k]["text"]);
          var parsedWords = bigObj["regions"][i]["lines"][j]["words"][k]["text"];

          //If the 'ingredients' hasn't started yet ... 
          if (!start) {
            if (strStart == parsedWords.toLowerCase()) {
              //console.log("INPUTTING STARTED."); //DEBUGGING
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

            for (var l = 0; l < lenArrEndings; l++) {
              if (arrEndings[l] == parsedWords.toLowerCase()) {
                //console.log("INPUTTING ENDED"); //DEBUGGING
                end = true;
                break;
              }
            }

            //Add to the ingredients array if it hasn't ended... 
            if (!end) {
              //console.log("INGREDIENT ADDED.") //DEBUGGING
              arrIngredients.push(parsedWords); 
            }
          }
        }
      }
    }

    //Return the output ... 
    callback(arrIngredients);

  });

}

//Function jsonToFlags combines the previous two functions in serial ... 
var jsonToFlags = function(objBig, callback) {
  //First function call ...
  jsonToIng(objBig, (data) => {
    //Second function call ... 
    ingToFlags(data, (flags) => {
      //Callback
      callback(flags);
    })
  })
}

module.exports = {
  ingToFlags: ingToFlags,
  jsonToIng: jsonToIng,
  jsonToFlags: jsonToFlags
}
