

import './ui.js';                       // shared animations (styling only)
import { mare } from './marv.js'
import { naira } from './fmt.js';

let total = localStorage.getItem('total');


/* ---------- signed out: create account + login ---------- */
let pagea = `
<header class="gbar">
  <div class="gbar-inner">
    <a class="gbrand" href="/costom_ui.html">
      <span class="gmark" aria-hidden="true"></span>
      Marvel<span class="dot">.dev</span>
    </a>
    <span class="gspacer"></span>
    <a class="gnav-link" href="/costom_ui.html">Continue shopping</a>
  </div>
</header>

<main class="auth-wrap">

  <div class="auth-intro">
    <span class="g-chip">Account</span>
    <h1>Welcome to <span>Marvel.dev</span></h1>
    <p>Create an account, or sign in to your existing one, to finish your order.
       Your cart is saved on this device.</p>
  </div>

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

</div>
</main>
`;


/* ---------- signed in: order summary ---------- */
let pageb = `
<header class="gbar">
  <div class="gbar-inner">
    <a class="gbrand" href="/costom_ui.html">
      <span class="gmark" aria-hidden="true"></span>
      Marvel<span class="dot">.dev</span>
    </a>
    <span class="gspacer"></span>
    <a class="gnav-link" href="/costom_ui.html">Continue shopping</a>
  </div>
</header>

<main class="auth-wrap">

  <div class="auth-actions">
    <button onclick="back()" >Back to cart</button>
    <button onclick="logout()" >Log out</button>
  </div>

  <div class="cart-total">
    <h2>Cart Total</h2>
    <p>Total: <span class="total-price">${naira(total)}</span></p>
    <button onclick ='send()'  class="checkout">Checkout</button>
  </div>

</main>
`;


function logout() {
  localStorage.removeItem('man');
  gen();
};


function send() {

  let tokin = localStorage.getItem('man');

  console.log('TOKEN:', tokin);

  let btn = document.querySelector('.checkout');
  let stopBusy = window.gBusy ? window.gBusy(btn, 'Placing order\u2026') : function () {};

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
  .then(response => response.json().then(data => ({ ok: response.ok, data })))
  .then(({ ok, data }) => {

    stopBusy();
    console.log(data);

    if (ok && data && data.message === 'order placed') {

      /* ---- order confirmed ---- */
      window.gDialog({
        title: 'Your order has been placed',
        message: 'Thanks! We have received your order and will be in touch shortly.',
        actions: [
          { label: 'Continue shopping', href: '/costom_ui.html' },
          { label: 'Stay here', variant: 'text' }
        ]
      });

      return;
    };

    /* ---- the server said no ---- */
    window.gDialog({
      type: 'error',
      title: 'We could not place your order',
      message: (data && (data.message || data.messages)) || 'Please try again in a moment.',
      actions: [{ label: 'OK', variant: 'text' }]
    });

  })
  .catch((error) => {

    stopBusy();
    console.log('order error:', error);

    window.gDialog({
      type: 'error',
      title: 'We could not place your order',
      message: 'Something went wrong on the way to the server. Please check your connection and try again.',
      actions: [{ label: 'OK', variant: 'text' }]
    });

  });
}


function gen() {
  if (localStorage.getItem('man')) {
    document.body.innerHTML = pageb;
  } else {
    document.body.innerHTML = pagea;
  };
}


function add() {

  let name = document.querySelector('.name').value;
  let passw = document.querySelector('.password').value;
  let email = document.querySelector('.email').value;

  fetch('/acunt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      passw,
      email
    })

  }).then((marv) => marv.json()).then((feedback) => {

    let marv = feedback.messages;

    let marve = feedback.logine;

    if (marve) {
      localStorage.setItem('man', marve);
      gen();
      return;
    };

    let box = document.querySelector('.resot');
    if (box) box.innerHTML = marv || 'Could not create the account';

  }).catch((error) => {

    console.log('signup error:', error);

    let box = document.querySelector('.resot');
    if (box) box.innerHTML = 'Could not reach the server, please try again';

  });

};


function login() {
  let passw = document.querySelector('.passworde').value;
  let email = document.querySelector('.emaile').value;

  fetch('/acunte', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      passw,
      email
    })

  }).then((marv) => marv.json()).then((feedback) => {
    console.log(feedback);
    let marv = feedback.message;
    let marve = feedback.logine;

    if (marve) {
      localStorage.setItem('man', marve);
      gen();
      return;
    };

    let box = document.querySelector('.reso');
    if (box) box.innerHTML = marv || 'Could not sign you in';

  }).catch((error) => {

    console.log('login error:', error);

    let box = document.querySelector('.reso');
    if (box) box.innerHTML = 'Could not reach the server, please try again';

  });

};


function back() {
  document.location.href = '/recat.html';
};


window.login = login;
window.add = add;
window.logout = logout;
window.send = send;
window.back = back;


gen();


console.log(mare);
