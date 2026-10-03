import './ui.js';                       // shared animations (styling only)
import { prodoct } from './costom.js';
import { mane, mare } from './marv.js';
import { naira } from './fmt.js';


prodoct().then((marvel) => {
  console.log(marvel);

  dipl(marvel);
});


function dipl(marvel) {
  let marv = marvel;
  let how = '';

  marv.forEach((marve) => {

    how += `<div class="cade">
      <img src="${marve.Image}" class='comeimg'>
    <div class='info'>
      <p>${marve.Name}</p>
      <p>${naira(marve.price)}</p>
      <button data-id="${marve._id}" class='add'>add</button>
    </div>
    </div>`;
  })

  let grid = document.querySelector('.rice');
  if (grid) grid.innerHTML = how;
};


function add(id) {
  let rice = id;
  mane(rice);
};

let grid = document.querySelector('.rice');

if (grid) {
  /* one listener for the whole grid — works for cards added at any time */
  grid.addEventListener('click', (event) => {
    let btn = event.target.closest ? event.target.closest('.add') : null;
    if (btn) add(btn.dataset.id);
  });
}

let cartLink = document.querySelector('.cart');
if (cartLink) {
  cartLink.addEventListener('click', () => {
    go();
  });
}

let loginBtn = document.querySelector('.login');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    login();
  });
}

function go() {
  document.location.href = '/recat.html';
};

function login() {
  document.location.href = '/login.html';
};


/*
 export function updateCartCount() {
  let quantity = 0;

  car.forEach((item) => {
    quantity += item.cunt;
  });

  const badge = document.querySelector('.cart-count');

  if (badge) {
    badge.textContent = quantity;
  }
}
  */



let quantity = 0;

mare.forEach((item) => {
  quantity += item.cunt;
});

let badge = document.querySelector('.cart-count');
if (badge) badge.textContent = quantity;

