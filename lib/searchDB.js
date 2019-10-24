function parseFilters(field) {
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

function searchDB(arr, search) {
	var rawData = [];

	var jsonKept = "<!DOCTYPE html><html><head><title>ANALYSIS</title></head><body>";

	for(var i = 0; i < arr.length; i++) {
		var jsonChunk = "<pre>" + JSON.stringify(arr[i].data, null, 4) + "</pre><br><br>";
		console.log(arr[i]);
		var meetsFilters = true;
		for(var k in search) {

			if(eval("search." + k) !== "") {
				try {
					if(!eval(parseInt(eval("search." + k).match(/\d+/g)) + parseFilters(eval("search." + k)) + "arr[i].data." + k)) {
						meetsFilters = false;
					}
				} catch {

				}
			}
		}
		console.log(meetsFilters);
		if(meetsFilters === true) {
			jsonKept += jsonChunk;
		}
	}
	jsonKept += "</body></html>"
	console.log("kept:\n\n\n");
	console.log(jsonKept);
	return jsonKept;
}


module.exports = {
	searchDB: function(obj, searchObj) {
		return searchDB(obj, searchObj);
	}
}