window.onload = function() {
  console.log(data);
  var html = [];
  var subcategories = [];
  var headings = [
    ["<h1>", "</h1>"],
    ["<h2>", "</h2>"],
    ["<h3>", "</h3>"],
    ["<h4>", "</h4>"],
    ["<h5>", "</h5>"],
    ["<h6>", "</h6>"]
  ];
  for(var i = 0; i < data.categories.length; i++) {
    console.log(i);
    if(data.categories[i].categories) {
      subcategories.push([i, data.categories[i].categories]);

    }
    html.push([headings[0][0] + data.categories[i].name + headings[0][1]]);
  }
  console.log(html);
  console.log(subcategories);
}
