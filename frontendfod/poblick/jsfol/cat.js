

import {mare} from './marv.js'

 let total = localStorage.getItem('total');



 let pagea =`
 <div class="all">

 <div class="first">
  <P class='info'> create new acunt </p>
 <input type="text" class="name" placeholder="name">
<p class="bro"></p>
<input type="password" class="password" placeholder="password">
<p class="bro"></p>
<input type="email" class="email" placeholder="email">
<p class="bro"></p>
<button onclick="add()" >creat acount</button>
<p class="resot"></p>
  </p>
  </div>

<div class="second">
<p class='info'> loging to your account</p>
<input type="password" class="passworde" placeholder="password">
<p class="bro"></p>
<input type="email" class="emaile" placeholder="email">
<p class="bro"></p>
<button onclick="login()" >login</button>
<p class="bro"></p>
<p class="reso"></p>
</div>
 `;

 let pageb = `
  <button onclick="back()()" >back</button>
  <button onclick="logout()" >logo out</button>
 
  <div class="cart-total">
  <h2>Cart Total</h2>
  <p>Total: ₦<span class="total-price">${total}</span></p>
  <button onclick ='send()'  class="checkout">Checkout</button>
</div>
</div>

 `;


function logout(){
 localStorage.removeItem('man');
 gen();
};


function send() {

  let tokin = localStorage.getItem('man');

  console.log('TOKEN:', tokin);

  fetch('/cat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokin}`
    },
    body: JSON.stringify({
      mare
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
}





function gen(){



if(localStorage.getItem('man')) {
   document.body.innerHTML=pageb;
  }else{
    document.body.innerHTML=pagea;
  };
}

   function add(){
    
    let name = document.querySelector('.name').value;
    let passw = document.querySelector('.password').value;
    let email = document.querySelector('.email').value;

    fetch('/acunt',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'  
    },
    body:JSON.stringify({
      name,
      passw,
      email
    })

    }).then((marv) => marv.json()).then((feedback) =>{

      let marv = feedback.messages;

      let marve = feedback.logine;

      if (marve){
        localStorage.setItem('man',marve);
         gen();
         return;
      };

       document.querySelector('.resot')
      .innerHTML=marv;
    });

   };
  



   function login(){
    let passw = document.querySelector('.passworde').value;
    let email = document.querySelector('.emaile').value;

    fetch('/acunte',{
      method:'POST',
      headers:{
        'Content-Type':'application/json' 
    },
    body:JSON.stringify({
      passw,
      email
    })

    }).then((marv) => marv.json()).then((feedback) =>{
      console.log(feedback);
      let marv = feedback.message;
      let marve = feedback.logine;

      if (marve){
        localStorage.setItem('man',marve);
         gen();
         return;
      };
      
     //console.log(feedback);
      document.querySelector('.reso')
      .innerHTML=marv;
    });

   };

   function back(){
    document.location.href='/recat.html';
   };

   window.login = login;
window.add = add;
window.logout = logout;
window.send = send;
window.back = back;
  

   gen();


   console.log(mare);
