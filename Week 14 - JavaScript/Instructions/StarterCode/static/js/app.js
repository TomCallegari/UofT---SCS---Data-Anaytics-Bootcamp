
var tableData = data;
var tbody = d3.select('tbody');

data.forEach((ufoSighting) => {
  var row = tbody.append("tr");
  Object.entries(ufoSighting).forEach(([key, value]) => {
    var cell = row.append("td");
    cell.text(value);
  });
});

var filterBtn = d3.select('#filter-btn');
var enterDate = d3.select('#datetime');

filterBtn.on('click', function() {
  tbody.html('')
  var inputValue = enterDate.property('value');
  var filteredData = tableData.filter(sighting => sighting.datetime == inputValue);
  filteredData.forEach((ufoSighting) => {
    var row = tbody.append('tr');
    Object.entries(ufoSighting).forEach(([key, value]) => {
      var cell = row.append('td');
      cell.text(value);
    })
  })
  if (inputValue == '') {
    tbody.html('')
    data.forEach((ufoSighting) => {
      var row = tbody.append('tr');
      Object.entries(ufoSighting).forEach(([key, value]) => {
        var cell = row.append('td');
        cell.text(value);
      });
    });
  };
});


