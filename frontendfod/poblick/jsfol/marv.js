

export let mare =
JSON.parse (localStorage.getItem('mae')) || [];


export function mane(id) {

    let chek='';
  mare.forEach((marv) => {
    if(marv.id === id){
      chek = marv;
    };
  });
 if (chek){
 chek.cunt+=1;
 }else{
   mare.push({
    id:id,
    cunt:1
   });
};

 console.log(mare);
localStorage.setItem('mae',JSON.stringify(mare));

let quantity =0;

  mare.forEach((item) => {
    quantity += item.cunt;
  });

  // show immediately
  document.querySelector('.cart-count').textContent = quantity;




};

