let snd1 = new Audio();
snd1.src = './src/1.mp3';
let snd2 = new Audio();
snd2.src = './src/2.mp3';
let sound = [snd1, snd2];

const _shufle = document.querySelector('#shufle');
const state = {
  words: [
    'код',
    'говнокод',
    'сайт',
    'сервер',
    'фронтенд',
    'студент',
    'ноутбук',
    'массив',
    'объект',
    'функция',
    'класс',
    'язык',
  ],
  currWords: [],
  select: [],
  dir: null,
};
createTable(12);

window.addEventListener('mousedown', (e) => {
  e.preventDefault();
  if (e.target.tagName == 'TD') {
    document.querySelectorAll('td').forEach((item) => {
      item.addEventListener('mouseover', userSelect);
    });
    e.target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  }
});

window.addEventListener('mouseup', (e) => {
  // console.log(state.select);
  if (e.target.tagName != 'TD') return;
  document.querySelectorAll('td').forEach((item) => {
    item.removeEventListener('mouseover', userSelect);
  });

  let selected = document.querySelectorAll('.td-active');
  selected.forEach((item) => item.classList.remove('td-active'));

  console.log(state.select);
  console.log(state.currWords);

  state.currWords.forEach((word, ind) => {
    let isFind = null;
    for (let i = 0; i < word.pos.x.length; i++) {
      if (state.select.length != word.pos.x.length) {
        isFind = false;
        break;
      }
      if (word.pos.x.includes(state.select[i].x) && word.pos.y.includes(state.select[i].y)) {
        isFind = true;
      } else {
        isFind = false;
        break;
      }
    }

    if (isFind) {
      sound[rand(0, 1)].play();
      state.currWords[ind].find = isFind;
      word.pos.x.forEach((x) => {
        word.pos.y.forEach((y) => {
          let td = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
          td.classList.remove('td-active');
          td.classList.add('td-find');
        });
      });
    }
    if (word.find) {
      let _w = document.querySelector(`[data-value="${word.value}"]`);
      _w.classList.add('word-find');
    }
  });

  state.select = [];
  state.dir = null;
});

_shufle.addEventListener('click', shufle);

function userSelect(e) {
  let arr = state.select;
  let prev = {};
  let curr = {};
  let tar = e.target;
  prev.e = e.fromElement;
  prev.x = prev.e ? prev.e.getAttribute('data-x') : null;
  prev.y = prev.e ? prev.e.getAttribute('data-y') : null;
  curr.e = e.toElement;
  curr.x = curr.e.getAttribute('data-x');
  curr.y = curr.e.getAttribute('data-y');
  // if (isDiff(curr.x, prev.x) && state.dir == null) {
  //   console.log(prev);
  //   console.log('this x');
  //   state.dir = 'x';
  // } else if (isDiff(curr.y, prev.y) && state.dir == null) {
  //   console.log(prev);
  //   console.log('this y');
  //   state.dir = 'y';
  // }
  if (arr.length > 1) {
    if (isDiff(arr[arr.length - 1].x, arr[arr.length - 2].x) && state.dir == null) {
      state.dir = 'x';
    } else if (isDiff(arr[arr.length - 1].y, arr[arr.length - 2].y) && state.dir == null) {
      state.dir = 'y';
    }

    if (
      (curr.x == arr[arr.length - 2].x && state.dir == 'x') ^
      (curr.y == arr[arr.length - 2].y && state.dir == 'y')
    ) {
      prev.e.classList.remove('td-active');
      state.select.pop();
      if (state.select.length == 1) {
        state.dir = null;
      }
      return;
    }
  }

  if (tar.tagName == 'TD') {
    if (state.select.length <= 1) {
      state.select.push({ x: +tar.getAttribute('data-x'), y: +tar.getAttribute('data-y') });
      tar.classList.add('td-active');
    } else if (
      (isDiff(curr.x, prev.x) && state.dir == 'x') ^ (isDiff(curr.y, prev.y) && state.dir == 'y')
    ) {
      if ((state.dir == 'x' && curr.y == arr[1].y) ^ (state.dir == 'y' && curr.x == arr[1].x)) {
        state.select.push({ x: +tar.getAttribute('data-x'), y: +tar.getAttribute('data-y') });
        tar.classList.add('td-active');
      }
    }
  }
}

function shufle(e) {
  const alph = [
    'а',
    'б',
    'в',
    'г',
    'д',
    'е',
    'ё',
    'ж',
    'з',
    'и',
    'й',
    'к',
    'л',
    'м',
    'н',
    'о',
    'п',
    'р',
    'с',
    'т',
    'у',
    'ф',
    'х',
    'ц',
    'ч',
    'ш',
    'щ',
    'э',
    'ю',
    'я',
  ];
  const dir = ['x', 'y'];
  const words = state.words;
  state.currWords = [];
  let _words = document.querySelector('#words');
  const tbl = document.querySelector('#game').querySelector('table');
  // const tr = tbl.querySelectorAll('tr');
  // const td = tbl.querySelectorAll('td');
  const tr = queryAll(tbl, 'tr');
  const td = queryAll(tbl, 'td');
  const size = tr.length;

  _words.innerHTML = '';

  tr.forEach((item) => {
    td.forEach((i) => {
      i.textContent = alph[randEl(alph)];
      i.classList.remove('td-active');
      i.classList.remove('td-find');
    });
  });

  words.forEach((word, ind) => {
    if (word.length > size) return;
    // console.log(td);
    let coll = false;
    let pos = {};
    pos.x = rand(0, size - word.length);
    state.currWords.push({
      value: word,
      row: ind,
      find: false,
      pos: {
        x: fillArr(pos.x, pos.x + word.length),
        y: [ind],
      },
    });
    let sel = td.filter((item) => item.getAttribute(`data-y`) == ind);
    let select = sel.slice(pos.x, pos.x + word.length);
    select.forEach((item, i) => {
      item.textContent = word[i];
    });

    // if (dir[randEl(dir)] == 'x') {

    // } else {
    // }
  });
  console.log(state);
  state.words.forEach((word) => {
    let str = document.createElement('span');
    str.textContent = word;
    str.setAttribute('data-value', word);
    _words.append(str);
  });
}

function createTable(size) {
  const tbl = document.createElement('table');
  for (let i = 0; i < size; i++) {
    let tr = document.createElement('tr');
    tr.setAttribute('data-row', i);
    for (let j = 0; j < size; j++) {
      let td = document.createElement('td');
      td.setAttribute('data-y', i);
      td.setAttribute('data-x', j);
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
  document.querySelector('#game').appendChild(tbl);
}

function rand(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
function randEl(el) {
  let rand = 0 + Math.random() * el.length;
  return Math.floor(rand);
}

function queryAll(parent, selector) {
  let items = parent.querySelectorAll(selector);
  let arr = [];
  items.forEach((item) => arr.push(item));
  return arr;
}

function fillArr(start, end) {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i);
  }
  return arr;
}

function isDiff(curr, prev) {
  curr = curr ?? 0;
  prev = prev ?? 0;
  return Math.abs(curr - prev) == 1;
}
