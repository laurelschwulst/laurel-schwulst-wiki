// DATA

var jsonData = null;

document.addEventListener(
  "DOMContentLoaded",
  function () {
    fetch("./js/icons.json")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        data.map((item) => {
          // $('#favicons').append(`<a href="${item.url}" target="viewport"${item.color ? ` style="background:${item.color};"` : ``}>${item.icon ? `<img src="images/${item.icon}">` : ``}</a>`);
        });

        function doIt() {
          jsonData = data;

          // start: only shows a seventh per day of week
          // const dayOfWeekIndex = new Date().getDay();
          // jsonData = jsonData.filter(function (icon, index) {
          // 	return index % 7 === dayOfWeekIndex;
          // });
          // end: only shows a seventh per day of week

          jsonData = shuffle(jsonData);
          makeSpiral();
        }

        doIt();
      })
      .catch((error) => console.error(error));
  },
  false
);

// SPIRAL

function makeSpiral() {
  const size = 16;
  const count = jsonData.length;
  let currentIndex = 0;

  let bounds = [
    [0, window.innerWidth - size],
    [0, window.innerHeight - size],
  ];

  // Top right corner
  let lastBlockPosition = [bounds[0][1], bounds[1][0] - size + 16];
  // Moving down
  let velocity = [0, 16];

  setInterval(function () {
    if (currentIndex >= count) return;
    const candidateBlockPosition = [
      lastBlockPosition[0] + velocity[0],
      lastBlockPosition[1] + velocity[1],
    ];
    if (candidateBlockPosition[0] > bounds[0][1]) {
      // Hit right side, turn down
      bounds[1][0] += size;
      velocity = [0, size];
      lastBlockPosition[0] = bounds[0][1];
    } else if (candidateBlockPosition[0] < bounds[0][0]) {
      // Hit left side, turn up
      bounds[1][1] -= size;
      velocity = [0, -size];
      lastBlockPosition[0] = bounds[0][0];
    } else if (candidateBlockPosition[1] > bounds[1][1]) {
      // Hit bottom, turn left
      bounds[0][1] -= size;
      velocity = [-size, 0];
      lastBlockPosition[1] = bounds[1][1];
    } else if (candidateBlockPosition[1] < bounds[1][0]) {
      // Hit top, turn right
      bounds[0][0] += size;
      velocity = [size, 0];
      lastBlockPosition[1] = bounds[1][0];
    }
    const nextBlockPosition = [
      lastBlockPosition[0] + velocity[0],
      lastBlockPosition[1] + velocity[1],
    ];
    addBlockAtPosition(
      nextBlockPosition[0],
      nextBlockPosition[1],
      currentIndex
    );
    lastBlockPosition = nextBlockPosition;
    ++currentIndex;
  }, 88);

  function addBlockAtPosition(x, y, index) {
    item = jsonData[index];
    const el = document.createElement("a");
    const img = document.createElement("img");
    // console.log(x,y)
    el.setAttribute("href", item.url);
    el.setAttribute("target", "viewport");
    el.style.position = "fixed";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.backgroundColor = item.color;
    if (item.icon) {
      img.setAttribute("src", "images/icons/" + item.icon);
      el.appendChild(img);
    }
    if (item.borderradius) {
      el.style.borderRadius = item.borderradius;
    }
    document.body.appendChild(el);
  }
}

// SHUFFLE

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// MOBILE

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  const iframe = document.getElementById("portal");
  iframe.setAttribute("scrolling", "no");
}
