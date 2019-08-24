window.onload = function() {
  console.log(data);
  var html = [];
  var subcategories = [[]];
  var headings = [
    ["<h1>", "</h1>"],
    ["<h2>", "</h2>"],
    ["<h3>", "</h3>"],
    ["<h4>", "</h4>"],
    ["<h5>", "</h5>"],
    ["<h6>", "</h6>"]
  ];
  var currentCategoryLevel = 0;
  for(var i = 0; i < data.categories.length; i++) {
    console.log(i);
    subcategories[currentCategoryLevel].push(data.categories[i].categories);
    html.push([headings[0][0] + data.categories[i].name + headings[0][1]]);
  }
  var finished = false;
  var timeout = 0;
  while(finished === false) {
    currentCategoryLevel++;
    subcategories.push([]);
    for(var i = 0; i < subcategories[currentCategoryLevel-1].length; i++) {
      subcategories[currentCategoryLevel].push(subcategories.categories);
      console.log(subcategories[currentCategoryLevel-1][i]);
      if(subcategories[currentCategoryLevel-1][i]) {
        for(var j = 0; j < subcategories[currentCategoryLevel-1][i].length; j++) {
          html.splice(i, 0, headings[currentCategoryLevel][0] + subcategories[currentCategoryLevel-1][i][j].name + headings[currentCategoryLevel][1]);
          console.log("INSERTING: " + subcategories[currentCategoryLevel-1][i][j].name);
        }
      }
    }

    timeout++;
    if(timeout > 100) {
      finished = true;
      console.log("timed out");
    }
  }
  console.log("...");
  console.log(html);
  console.log(subcategories);
  for(var i = 0; i < html.length; i++) {
    document.body.innerHTML += html[i];
  }

}
