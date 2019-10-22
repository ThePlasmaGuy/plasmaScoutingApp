function parseFilters(field) {
	var filters = [];
	if(eval("search." + field).substring(0, 1) === "=") {
		return "==";
	} else if(eval("search." + field).substring(0, 2) === ">=") {
		return ">=";
	} else if(eval("search." + field).substring(0, 2) === "<=") {
		return "<=";
	} else if(eval("search." + field).substring(0, 1) === ">") {
		return ">";
	} else if(eval("search." + field).substring(0, 1) === "<") {
		return "<";
	} else if(eval("search." + field).substring(0, 2) === "!=") {
		return "!==";
	} else {
		throw "ERROR: Invalid Parameter";
	}
}



function searchDB(arr, search) {
	var rawData = [];
	var jsonKept = [];
	var filters = [];
	for(var i = 0; i < arr.length; i++) {
		rawData.push(arr[i].data);
	}



	for(var k in search) {

	}
}