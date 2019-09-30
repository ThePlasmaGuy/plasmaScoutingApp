var headings = [
  ["<h1>", "</h1>"],
  ["<h2>", "</h2>"],
  ["<h3>", "</h3>"],
  ["<h4>", "</h4>"],
  ["<h5>", "</h5>"],
  ["<h6>", "</h6>"]
];

var catLevel = 0;

var positions = [];

var prevObj = {};
var html = "";

function createHTML(obj) {
  catLevel++;
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      //catLevel = catLevel - 1;
      if (!obj[k].type) {
        createHTML(obj[k]);
      } else {
        html += obj[k].name;
        var required = "required";
        if (obj[k].required === false) {
          required = "";
        }
        //console.log(obj[k].id);
        if (obj[k].type === "int") {
          html += "<input type='number' max='" + obj[k].max + "' min='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + "/><br/>";
        } else if (obj[k].type === "dropdown") {
          html += "<select" + " id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + ">";
          for (var i = 0; i < obj[k].options.length; i++) {
            html += "<option value='" + obj[k].options[i].value + "'>" + obj[k].options[i].optionName + "</option>";
          }
          html += "</select><br/>";
        } else if (obj[k].type === "string") {
          html += "<input type='text' max='" + obj[k].max + "' min='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + "/><br/>";
        } else if (obj[k].type === "longString") {
          html += "<textarea maxlength='" + obj[k].max + "' minlength='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + "></textarea><br/>";
        }
      }
    } else {
      if (!obj.type && obj.name) {
        html += "<b>" + obj.name + "</b><br/>";
        //console.log(catLevel);
      } else if (obj.type && obj !== prevObj) {
        //console.log(obj);
        html += "<b>" + obj.name + "</b><br>";
      }
      prevObj = obj;
    }
  }
  //console.log(html);
}


module.exports = {
  generateHTML: function(obj) {
    createHTML(obj);
    return html;
  }
}