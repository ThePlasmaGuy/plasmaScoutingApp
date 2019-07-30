window.onload = function() {
  console.log(data);
  var html = "";
  var currentCategoryLevel = data.categories;
  var completed = false;
  var headerLevel = [
    ["<h1>", "</h1>"],
    ["<h2>", "</h2>"],
    ["<h3>", "</h3>"],
    ["<h4>", "</h4>"],
    ["<h5>", "</h5>"],
    ["<h6>", "</h6>"],
  ];
  var catLevel = 0;
  var header = 0
  while(completed === false) {

    for(var i = 0; i < currentCategoryLevel.length; i++) {
      console.log(currentCategoryLevel);
      console.log("entered loop");
      try {
        html = html + headerLevel[header][0] + currentCategoryLevel[i].name + headerLevel[header][1];
      } catch {
        console.log("ERROR: No name defined for category " + (i+1));
      }
      if(currentCategoryLevel[i].items) {
        for(var j = 0; j < currentCategoryLevel[i].items.length; j++) {
          var itemHeader = header + 1;
          if(itemHeader > 6) {
            itemHeader = 6;
          }
          html = html + headerLevel[itemHeader][0] + currentCategoryLevel[i].items[j].name + headerLevel[itemHeader][1];
        }
      }
      if(currentCategoryLevel[i].categories) {
        console.log("bazinga");
        completed = false
        header = header + 1;
        if(header > 6) {
          header = 6;
        }

        catLevel++;

        currentCategoryLevel = currentCategoryLevel[i].categories;
        console.log(currentCategoryLevel);
      } else {
        completed = true;
        if(catLevel > 0) {
          catLevel = catLevel - 1;
          currentCategoryLevel = data.categories;
          for(var i = 1; i < catLevel; i++) {
            currentCategoryLevel = currentCategoryLevel
          }
          completed = false;
        }
      }
    }
  }
  console.log("finished");
  document.body.insertAdjacentHTML("afterBegin", html);
}
