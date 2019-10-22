function parseFilters(field) {
  if (field.substring(0, 1) === "=") {
    return "==";
  } else if (field.substring(0, 2) === ">=") {
    return ">=";
  } else if (field.substring(0, 2) === "<=") {
    return "<=";
  } else if (field.substring(0, 1) === ">") {
    return ">";
  } else if (field.substring(0, 1) === "<") {
    return "<";
  } else if (field.substring(0, 2) === "!=") {
    return "!==";
  } else {
    throw "ERROR: Invalid Filter";
  }
}

function searchDB(arr, search) {
  var rawData = [];

  for (var i = 0; i < arr.length; i++) {
    rawData.push(arr[i].data);
  }

  var jsonKept = [];

  for (var i = 0; i < arr.length; i++) {
    for (var k in search) {
      var meetsFilters = true;
      if (eval("search." + k) !== "") {
        if (!eval(parseInt(eval("search." + k).match(/\d+/g)) + parseFilters(eval("search." + k)) + arr[i] + "." + k)) {
          meetsFilters = false;
        }
      }
      if (meetsFilters === true) {
        jsonKept.push(arr[i]);
      }
    }
  }
  console.log(jsonKept)
}