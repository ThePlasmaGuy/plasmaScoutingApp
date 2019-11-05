const fs = require("fs");
var inputsFile = JSON.parse(fs.readFileSync('./json/inputs.json', 'utf8'));
var scoutIDs = JSON.parse(fs.readFileSync('./json/scouts.json', 'utf8'));


function parseFilters(field) {
	console.log(field);
	if(field.substring(0, 1) === "=") {
		return "==";
	} else if(field.substring(0, 2) === "<=") {
		return ">=";
	} else if(field.substring(0, 2) === ">=") {
		return "<=";
	} else if(field.substring(0, 1) === "<") {
		return ">";
	} else if(field.substring(0, 1) === ">") {
		return "<";
	} else if(field.substring(0, 2) === "!=") {
		return "!==";
	} else {
		throw "ERROR: Invalid Filter";
	}
}

var kvp = {};

function iter(key, value, search) {
	for(var k in search) {
		if(typeof search[k] == "object" && search[k] !== null) {
			//catLevel = catLevel - 1;
			if(eval("search[k]." + key + "==\"" + value + "\"") === true) {
				kvp = search[k];
			} else {
				iter(key, value, search[k]);
			}

		}
	}
}

function findKeyValuePair(key, value, search) {
	iter(key, value, search);
	var kvpReturn = JSON.parse(JSON.stringify(kvp));
	kvp = {};
	return kvpReturn;
}

function searchDB(arr, search, inputsJSON) {
	var rawData = [];
	console.log(search);
	var jsonKept = "<!DOCTYPE html><html><head><title>ANALYSIS</title></head><body>";

	for(var i = 0; i < arr.length; i++) {
		var jsonChunk = "<pre>" + JSON.stringify(arr[i].data, null, 4) + "</pre><br><br>";
		var meetsFilters = true;
		for(var k in search) {
			var inputsObj = findKeyValuePair("id", k, inputsFile);
			if(inputsObj.type === "int") {
				if(eval("search." + k) !== "") {
					try {
						if(!eval(parseInt(eval("search." + k).match(/\d+/g)) + parseFilters(eval("search." + k)) + "arr[i].data." + k)) {
							meetsFilters = false;
						}
					} catch {
						meetsFilters = false;
					}
				}
			} else if(inputsObj.type === "dropdown") {
				if(eval("search." + k) !== "") {
					try {
						if(!eval("search." + k + "==arr[i].data." + k)) {
							meetsFilters = false;
						}
					} catch {

					}
				}
			} else if(inputsObj.type === "string") {
				if(eval("search." + k) !== "") {
					var regexp = new RegExp(eval("search." + k));
					if(regexp.test(eval("arr[i].data." + k)) === false) {
						meetsFilters = false;
					}
				}
			}
		}
		if(meetsFilters === true) {
			jsonKept += jsonChunk;
		}
	}
	jsonKept += "</body></html>"
	return jsonKept;
}

function isValidScoutID(id) {
	for(var i = 0; i < scoutIDs.length; i++) {
		if(scoutIDs[i].id == id) {
			return true;
			break;
		}
	}
}

function getScoutName(id) {
	for(var i = 0; i < scoutIDs.length; i++) {
		if(scoutIDs[i].id == id) {
			return scoutIDs[i].name;
			break;
		}
	}
	return null;
}

module.exports = {
	searchDB: function(obj, searchObj) {
		return searchDB(obj, searchObj);
	},
	isValidScoutID: function(id) {
		return isValidScoutID(id)
	},
	getScoutName: function(id) {
		return getScoutName(id)
	}
}