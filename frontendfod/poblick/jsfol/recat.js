import './ui.js';                       // shared animations (styling only)
import { prodoct } from './costom.js';
import { mare } from './marv.js';
import { naira } from './fmt.js';
//import { updateCartCount } from './dir.js';


let car = mare;

console.log(car);
export let total = 0;

function all() {
  let page = "";
  total = 0;

  prodoct().then(marv => {

    console.log(marv);

    car.forEach((cat) => {
      let display;

      marv.forEach((prod) => {
        if (prod._id === cat.id) {
          display = prod;
        };
      });

      if (display) {
        total += Number(display.price) * cat.cunt;
        page += `
  <div class="rice">
  <div class="allinfo">
    <p class="info">Name: ${display.Name}</p>
    <p class="info">price: ${naira(display.price)}</p>
    <p class="info">Quantity: ${cat.cunt}</p>
  </div>
  <div>
    <button data-act="plus" data-id="${cat.id}">+</button>
    <span>${cat.cunt}</span>
    <button data-act="mino" data-id="${cat.id}">-</button>
    <button data-act="delet" data-id="${cat.id}">delete</button>
  </div>
  <div class="img">
    <img class="img" src="${display.Image}" alt="">
  </div>
</div>

  `;
      };
    });

    localStorage.setItem('total', total);
    let section = document.querySelector('.section');
    if (section) section.innerHTML = page;
  });
};


/* The three row buttons are wired to one delegated listener instead of inline
   onclick strings, so a product id containing a quote can never break the
   markup. Calling plus / mino / delet works exactly as before. */
let section = document.querySelector('.section');

if (section) {
  section.addEventListener('click', (event) => {
    let btn = event.target.closest ? event.target.closest('button[data-act]') : null;
    if (!btn) return;

    let id = btn.dataset.id;

    if (btn.dataset.act === 'plus') plus(id);
    else if (btn.dataset.act === 'mino') mino(id);
    else if (btn.dataset.act === 'delet') delet(id);
  });
}


function plus(id) {
  car.forEach((catt) => {
    if (id === catt.id) {
      catt.cunt++;
    }
  });
  localStorage.setItem('mae', JSON.stringify(car));
  
  all();
};


function mino(id) {
  car.forEach((catt) => {
    if (id === catt.id && catt.cunt > 1) {
      catt.cunt--;
    }
  });
  localStorage.setItem('mae', JSON.stringify(car));

  all();
};


function delet(id) {
  car = car.filter((catt) => {
    return catt.id !== id;
  });

  localStorage.setItem('mae', JSON.stringify(car));
   
  all();
}


window.plus = plus;
window.mino = mino;
window.delet = delet;


all();

let checkoutBtn = document.querySelector('.chekout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    document.location.href = '/login.html';
  });
}

let backBtn = document.querySelector('.back');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    document.location.href = '/costom_ui.html';
  });
}
