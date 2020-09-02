/* eslint-disable no-undef */
const canvas = document.querySelector('.canvas__inner');
let cardArr = [];
let outputArr = [];
let lineArr = [];
let connect = [];
const panZoom = panzoom(canvas, {
  filterKey: function (/* e, dx, dy, dz */) {
    return true;
  },
  enableTextSelection: true,
  bounds: true,
  boundsPadding: 0.8,
  maxZoom: 1,
  minZoom: 1
});
panZoom.on('transform', function () {
  updateLine();
});

// Basic

document.querySelector('#addMessage').addEventListener('click', function () {
  createCard('Message');
});

document.querySelector('#addProduct').addEventListener('click', function () {
  createCard('Product');
});

document.querySelector('#addPromo').addEventListener('click', function () {
  createCard('Promo');
});

// Questions

document.querySelector('#addInput').addEventListener('click', function () {
  createCard('Input');
});

document.querySelector('#addRadio').addEventListener('click', function () {
  createCard('Radio');
});

document.querySelector('#addText').addEventListener('click', function () {
  createCard('Text');
});

function createCard(feature) {
  const card = document.querySelector('#template' + feature).content.firstElementChild.cloneNode(true);
  const id = Date.now();
  let i = 0;

  card.id = 'card-' + id;
  card.style.position = 'absolute';
  card.style.top = `${Math.abs(canvas.getBoundingClientRect().top) + window.innerHeight / 2 - 190}px`;
  card.style.left = `${Math.abs(canvas.getBoundingClientRect().left) + window.innerWidth / 2 - 148}px`;

  card.addEventListener('mouseenter', function () {
    panZoom.pause();
  });

  card.addEventListener('mouseleave', function () {
    panZoom.resume();
  });

  card.addEventListener('click', function () {
    if (connect[0] && !connect[0].includes(id)) {
      const line = new LeaderLine(document.getElementById(connect[0]), document.getElementById(card.id), {
        color: '#e2e8f0',
        size: 3,
        startSocket: 'right',
        startPlug: 'behind',
        endSocket: 'left',
        endPlug: 'arrow3',
        endPlugSize: 1,
        endPlugColor: '#e2e8f0'
      });
      lineArr.push(line);
      document.getElementById(connect[0]).classList.add('connect');
      connect = [];
    } else {
      connect = [];
    }
  });

  card.querySelectorAll('.output').forEach(output => {
    output.id = 'output-' + id + '-' + i;
    i++;

    output.addEventListener('click', function (event) {
      event.stopPropagation();
      connect = [];

      if (lineArr.some(line => line.start.id === output.id)) {
        const x = lineArr.findIndex(line => line.start.id === output.id);

        lineArr[x].remove();
        lineArr.splice(x, 1);

        output.classList.remove('connect');
      } else {
        connect.push(output.id);
      }
    });
    outputArr.push(output);
  });

  card.querySelector('.action').addEventListener('click', function () {

    card.querySelectorAll('.output').forEach(output => {
      if (lineArr.some(line => line.start.id === output.id)) {
        const x = lineArr.findIndex(line => line.start.id === output.id);

        lineArr[x].remove();
        lineArr.splice(x, 1);
      }
    });

    const remove = lineArr.filter(line => line.end.id === card.id);

    lineArr = lineArr.filter(line => line.end.id !== card.id);

    remove.forEach(line => {
      document.getElementById(line.start.id).classList.remove('connect');
      line.remove();
    });

    card.remove();
    cardArr = cardArr.filter(obj => obj.id !== card.id);
  });

  const handle = card.querySelector('.handle');

  new PlainDraggable(canvas.appendChild(card), {
    onMove: function () {
      updateLine();
    },
    handle: handle,
    zIndex: 100
  });
  cardArr.push(card);
}

function updateLine() {
  for (let i = 0; i < lineArr.length; i++) {
    lineArr[i].position();
  }
}