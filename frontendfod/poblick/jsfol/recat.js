import {prodoct} from './costom.js';
import {mare} from './marv.js';

let car = mare;

console.log(car);
export let total = 0;
function all(){
  let page ="";
   total = 0;
prodoct().then( marv => {

  console.log(marv);

 car.forEach((cat) => {
let display;

  marv.forEach((prod) => {
if (prod._id === cat.id){
     display = prod;
};
 });
 
if (display){
   total += Number(display.price)*cat.cunt;
  page +=`
  <div class="rice">
  <div class="allinfo">
    <p class="info">Name: ${display.Name}</p>
    <p class="info">price: ${display.price}</p>
    <p class="info">Quantity: ${cat.cunt}</p>
  </div>
  <div>
    <button onclick="plus('${cat.id}')">+</button>
    <span>${cat.cunt}</span>
    <button onclick="mino('${cat.id}')">-</button>
    <button onclick="delet('${cat.id}')">delete</button>
  </div>
  <div class="img">
    <img class="img" src="${display.Image}">
  </div>
</div>

  `;
};
});
localStorage.setItem('total',total);
document.querySelector('.section')
.innerHTML= page;
});
};


function plus(id){
  car.forEach((catt) =>{
if (id === catt.id){
  catt.cunt++;
}
  });
localStorage.setItem('mae', JSON.stringify(car));
all();
};


function mino(id){
  car.forEach((catt) =>{
if (id === catt.id && catt.cunt > 1){
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

document.querySelector('.chekout')
.addEventListener('click',()=>{
  document.location.href= '/login.html';
})


document.querySelector('.back')
.addEventListener('click',()=>{
  document.location.href= '/costom_ui.html';
})
