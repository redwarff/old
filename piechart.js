var header;
var cx = document.querySelector("canvas").getContext("2d");
var figureNameInput = document.querySelector('#figureName');
var nameInput = document.querySelector('#name');
var countInput = document.querySelector('#count');
var colorInput = document.querySelector('#color');
var addBtn = document.querySelector('#addBtn');
var exportBtn = document.querySelector('#exportBtn');
var deleteAllBtn = document.querySelector('#deleteAllBtn');
var saveBtn = document.querySelector('#saveBtn');

addBtn.addEventListener('click', function (e) {
  addItem();
});
exportBtn.addEventListener('click', function (e) {
  exportImg();
});
deleteAllBtn.addEventListener('click', function (e) {
  deleteAll();
  render();
});
saveBtn.addEventListener('click', function (e) {
  save();
});
figureNameInput.addEventListener('input', function (e) {
  header = figureNameInput.value;
  render();
});


// data to be rendered
var localData = localStorage.localData ? JSON.parse(localStorage.localData) : null;
var results = localData ? localData.results : [
  { name: "Watching \"let's plays\"", count: 267, color: "lightblue" },
  { name: "Playing minecraft", count: 389, color: "lightgreen" },
  { name: "Drinking alcohol", count: 114, color: "pink" },
  { name: "Spamming comment sections", count: 189, color: "silver" }
];
header = localData ? localData.header : 'Favorite leisure activity of teenagers';
var deleteAll = function () {
  results = [];
}
var exportImg = function () {
  var canvas = document.querySelector("canvas");
  var image = canvas.toDataURL("image/png");
  window.open(image);
}
var save = function () {
  var localData = {
    header: header,
    results: results
  }
  localStorage.localData = JSON.stringify(localData);
  alert('Figure saved to localStorage');
}
var renderTable = function () {
  var table = document.createElement("table");

  var renderTableItem = function (item) {
    var tableRow = document.createElement("tr");
    for (var i = 1; i <= 5; i++) {
      var rowItem = document.createElement("td");

      if (i == 1) rowItem.textContent = item.name;

      else if (i == 2) rowItem.textContent = item.count;

      else if (i == 3) {
        var div = document.createElement('div');
        div.style.width = '25px';
        div.style.height = '15px';
        div.style.backgroundColor = item.color;
        div.style.verticalAlign = 'middle';
        rowItem.appendChild(div);
      }

      else if (i == 4) {
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener('click', function (e) {
          nameInput.value = item.name;
          countInput.value = item.count;
          colorInput.value = item.color;
          results.splice(results.indexOf(item), 1);
          render();
          nameInput.focus();
        });
        rowItem.appendChild(editBtn);
      }

      else {
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener('click', function (e) {
          results.splice(results.indexOf(item), 1);
          render();
        });
        rowItem.appendChild(deleteBtn);
      }
      tableRow.appendChild(rowItem);
    }
    table.appendChild(tableRow);
  }

  results.forEach(renderTableItem);
  var oldTable = document.querySelector("table");
  oldTable.parentNode.replaceChild(table, oldTable);
}
var addItem = function () {
  var name = nameInput.value;
  if (!name) {
    nameInput.focus();
    alert('Item name must be specified!');
    return;
  }
  var count = Number(countInput.value);
  if (isNaN(count)) {
    countInput.focus();
    alert('Count must be a number!');
    return;
  }
  var color = colorInput.value;
  results.push({
    name: name,
    count: count,
    color: color
  });
  nameInput.value = '';
  countInput.value = '';
  nameInput.focus();
  render();
}



var render = function () {
  cx.clearRect(0, 0, 700, 400);
  var total = results.reduce(function (sum, choice) {
    return sum + choice.count;
  }, 0);
  var renderHeader = function () {
    cx.font = "bold 25px Courier";
    cx.textBaseline = "bottom";
    cx.fillStyle = 'black';
    cx.textAlign = 'left';
    var headerNameX = Math.max(10, 350 - header.length * 7);
    cx.fillText(header, headerNameX, 70);
  }

  var renderBody = function () {
    var centerX = 350, centerY = 250;
    var currentAngle = -0.5 * Math.PI;
    results.forEach(function (result) {
      var sliceAngle = (result.count / total) * 2 * Math.PI;
      cx.beginPath();
      cx.arc(centerX, centerY, 100,
        currentAngle, currentAngle + sliceAngle);
      cx.lineTo(centerX, centerY);
      cx.fillStyle = result.color;
      cx.fill();
      cx.font = "bold 16px Courier";
      cx.textBaseline = "middle";
      var textAngle = currentAngle + sliceAngle / 2;
      var yoffset;
      if (textAngle > 0 && textAngle < Math.PI) yoffset = 8;
      else yoffset = -8;
      if (textAngle <= 0.5 * Math.PI) {
        cx.textAlign = "left";
        cx.fillText(result.name, centerX + 100 * Math.cos(textAngle) + 10, centerY + 100 * Math.sin(textAngle) + yoffset);
      }
      else {
        cx.textAlign = "right";
        cx.fillText(result.name, centerX + 100 * Math.cos(textAngle) - 10, centerY + 100 * Math.sin(textAngle) + yoffset);
      }
      currentAngle += sliceAngle;
    });
  }
  renderHeader();
  renderBody();
  renderTable();
}
render();
if (localStorage.localData) figureNameInput.value = header;
figureNameInput.focus();

