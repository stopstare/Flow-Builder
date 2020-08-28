/* eslint-disable no-undef */
const canvas = document.querySelector('.canvas__inner');
const panZoom = panzoom(canvas, {
  bounds: true,
  boundsPadding: 0.8,
  maxZoom: 1,
  minZoom: 0.1
});

let cardArr = [];
let outputArr = [];
let lineArr = [];
let connect = [];
panZoom.on('transform', function () {
  updateLine();
});

document.querySelector('#addRadio').addEventListener('click', function () {
  createCard('Radio');
});

document.querySelector('#addMessage').addEventListener('click', function () {
  createCard('Message');
});

document.querySelector('#addProduct').addEventListener('click', function () {
  createCard('Product');
});

function createCard(feature) {
  const card = document.querySelector('#template' + feature).content.firstElementChild.cloneNode(true);
  const id = Date.now();
  let i = 0;

  card.id = 'card-' + id;
  card.style.position = 'absolute';
  card.style.top = `${Math.abs(canvas.getBoundingClientRect().top) + window.innerHeight / 2 - 190}px`;
  card.style.left = `${Math.abs(canvas.getBoundingClientRect().left) + window.innerWidth / 2 - 148}px`;

  card.addEventListener('click', function () {
    if (connect[0] && !connect[0].includes(id)) {
      const line = new LeaderLine(document.getElementById(connect[0]), document.getElementById(card.id), {
        color: '#e2e8f0',
        size: 3,
        path: 'grid',
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

  card.querySelectorAll('.action')[0].addEventListener('click', function () {

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

  new PlainDraggable(canvas.appendChild(card), {
    onMove: function () {
      updateLine();
    }
  });
  cardArr.push(card);
}

function updateLine() {
  for (let i = 0; i < lineArr.length; i++) {
    lineArr[i].position();
  }
}