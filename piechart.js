var cx = document.querySelector("canvas").getContext("2d");
var figureNameInput = document.querySelector('#figureName');
var nameInput = document.querySelector('#name');
var countInput = document.querySelector('#count');
var colorInput = document.querySelector('#color');
var addBtn = document.querySelector('#addBtn');
var exportBtn = document.querySelector('#exportBtn');
var deleteAllBtn = document.querySelector('#deleteAllBtn');
var saveBtn = document.querySelector('#saveBtn');
var loadBtn = document.querySelector('#loadBtn');
var popupDiv;
var clickListener;

addBtn.addEventListener('click', function (e) {
  addItem();
});
exportBtn.addEventListener('click', function (e) {
  exportImg();
});
deleteAllBtn.addEventListener('click', function (e) {
  deleteAllItems();
  render();
});
saveBtn.addEventListener('click', function (e) {
  save();
});
loadBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  showLoad(e.pageX, e.pageY);
});
figureNameInput.addEventListener('input', function (e) {
  header = figureNameInput.value;
  render();
});

// preventing incompatibility errors with older versions
if (localStorage.localData && !JSON.parse(localStorage.localData).charts) localStorage.removeItem('localData');

// data to be rendered
var results;
var header;

var init = function () {
  results = [
    { name: "Watching \"let's plays\"", count: 267, color: "#3498DB" },
    { name: "Playing minecraft", count: 389, color: "#2ECC71" },
    { name: "Drinking alcohol", count: 114, color: "#9B59B6" },
    { name: "Spamming comment sections", count: 189, color: "#7F8C8D" }
  ];
  header = 'Favorite leisure activity of teenagers';
}
var deleteChart = function (chart, localData) {
  localData.charts.splice(localData.charts.indexOf(chart), 1);
  save(localData);
}
var showLoad = function (x, y) {
  hideLoad();
  var localData;
  if (localStorage.localData) localData = JSON.parse(localStorage.localData);
  if (localData) {
    var div = document.createElement('div');
    div.className = 'popup';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    var ul = document.createElement('ul');
    var createListItem = function (item) {
      var li = document.createElement('li');
      var deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteChart(item, localData);
        hideLoad();
        showLoad(x, y);
      });
      li.appendChild(deleteBtn);
      var a = document.createElement('a');
      a.textContent = item.name;
      a.href = "#";
      li.appendChild(a);
      li.addEventListener('click', function (e) {
        load(item);
        render();
        hideLoad();
      });
      ul.appendChild(li);
    }
    localData.charts.forEach(createListItem);
    div.appendChild(ul);
    document.body.appendChild(div);
    popupDiv = div;
    clickListener = document.body.addEventListener('click', function (e) {
      hideLoad();
    });
  }
  else if (!localData) alert('No data in localStorage');
}
var load = function (chart) {
  header = chart.name;
  results = chart.results;
}
var hideLoad = function () {
  if (popupDiv) document.body.removeChild(popupDiv);
  popupDiv = null;
  if (clickListener) document.body.removeEventListener('click', clickListener);
}
var deleteAllItems = function () {
  results = [];
}
var exportImg = function () {
  var canvas = document.querySelector("canvas");
  var image = canvas.toDataURL("image/png");
  window.open(image);
}
var save = function (customLocalData) {
  if (customLocalData) {
    localStorage.localData = JSON.stringify(customLocalData);
    return;
  }
  var localData = localStorage.localData ? JSON.parse(localStorage.localData) : { charts: [] };
  var chart = {
    name: header,
    results: results
  }
  localData.charts.push(chart);
  localStorage.localData = JSON.stringify(localData);
  alert('Figure saved to localStorage');
}
var renderTable = function () {
  var table = document.createElement("table");
  table.className = 'results';
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
  if (count < 0) {
    countInput.focus();
    alert('Count must be positive!');
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
init();
render();
if (localStorage.localData) figureNameInput.value = header;
figureNameInput.focus();

