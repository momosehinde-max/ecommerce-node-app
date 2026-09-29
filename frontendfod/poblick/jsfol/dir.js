import {prodoct} from './costom.js';
import {mane,mare} from './marv.js';


 prodoct().then((marvel) => {
        console.log(marvel); 
    
       dipl(marvel);
       
      });

  function dipl(marvel) {
let marv = marvel;
let how='';  
        marv.forEach((marve) => {

         how  +=  `<div class="cade">
      <img src="${marve.Image}" class='comeimg'>
    <div class='info'>
      <p>${marve.Name}</p>
      <p>${marve.price}</p>
      <button onclick="add('${marve._id}')" >add</button>
    </div>
    </div>`;
        })
       document.querySelector('.rice').innerHTML=how;
      };

   
function add(id){

  let rice = id;

   mane(rice);
};

document.querySelector('.cart')
.addEventListener('click',() => {
   go();
});

document.querySelector('.login')
.addEventListener('click',() => {
   login();
});

function go() {
  document.location.href='/recat.html';
};

function login() {
  document.location.href='/login.html';
};
      window.add = add;


      let quantity = 0;

mare.forEach((item) => {
  quantity += item.cunt;
});

document.querySelector('.cart-count').textContent = quantity;

