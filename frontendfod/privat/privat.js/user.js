
// money display helper (same output as /jsfol/fmt.js)
function naira(value) {
    const n = Number(value);
    if (!isFinite(n) || value === null || value === undefined || value === '') return '—';
    return '₦' + n.toLocaleString('en-NG');
}

// DISPLAY CUSTOMERS

let goback = 1;

// the customer list currently on screen (used for the header + names)
let list = [];

// the three title fragments in the nav
const frags = document.querySelectorAll('p.para');

function setTitle(a, b, c) {
    if (frags[0]) frags[0].textContent = a;
    if (frags[1]) frags[1].textContent = b;
    if (frags[2]) frags[2].textContent = c;
}

function setEmptyMessage(text) {
    const box = document.querySelector('.marv');
    if (box) box.dataset.empty = text;
}


async function diplay() {

    try {

        const response = await fetch(
            '/acunte',
            {
                method: 'GET'
            }
        );

        const customers = await response.json();

        list = customers;

        console.log(customers);


        let show = '';


        customers.forEach((customer) => {

            show += `
                <div class="butaddetal">

                    <div class="alldital">

                        <p class="detal">
                            Name: ${customer.name}
                        </p>

                        <p class="detal">
                            Email: ${customer.email}
                        </p>

                    </div>

                    <button 
                        class="seebt"
                        onclick="prodoct('${customer._id}')"
                    >
                        see older
                    </button>

                </div>
            `;

        });


        document.querySelector('.marv').innerHTML = show;

        // back to the customer list
        goback = 1;
        let nav = document.querySelector('.nav');
        if (nav) nav.classList.remove('is-drill');
        setTitle('see customers', '&', 'their order');
        setEmptyMessage('No customers yet \u2014 orders will show up here.');


    } catch (error) {

        console.log('Error getting customers:', error);

    }

}

// SHOW CUSTOMER ORDER

async function prodoct(id) {

    try {

        // GET CUSTOMER ORDER

        const orderResponse = await fetch(
            `/prodot/${id}`,
            {
                method: 'GET'
            }
        );

        const orders = await orderResponse.json();

        console.log('Customer order:', orders);

        // the server answers {message:'no alder'} when there is nothing yet
        const lines = Array.isArray(orders) ? orders : [];

        // GET ALL PRODUCTS

        const productResponse = await fetch(
            '/prodot',
            {
                method: 'GET'
            }
        );

        const products = await productResponse.json();

        console.log('All products:', products);


        // CREATE ORDER DISPLAY

        let show = '';


        lines.forEach((order) => {

            (order.mare || []).forEach((item) => {

                // Find the product

                const product = products.find((product) => {

                    return product._id === item.id;

                });


                // If product exists
                if (product) {

                    show += `
                        <div class="gen">

                            <div class="fest">

                                <p class="infor">
                                    Name: ${product.Name}
                                </p>

                                <p class="infor">
                                    Price: ${naira(product.price)}
                                </p>

                                <p class="infor">
                                    Quantity: ${item.cunt}
                                </p>

                            </div>

                            <div>
                                <img 
                                    class="img"
                                    src="${product.Image}"
                                >
                            </div>

                        </div>
                    `;

                }

            });

        });

        // DISPLAY ORDER

        document.querySelector('.marv').innerHTML = show;

        // show whose orders these are, and a message that fits the situation
        goback = 2;
        let person = list.find((c) => c._id === id);
        let nav = document.querySelector('.nav');
        if (nav) nav.classList.add('is-drill');
        setTitle('orders for', '&', person ? person.name : 'this customer');
        setEmptyMessage('This customer has not ordered anything yet.');


    } catch (error) {

        console.log('Error getting order:', error);

    }

}



window.prodoct = prodoct;

// LOAD CUSTOMERS

diplay();

function back(){
 if(goback === 1){
    document.location.href="ment.html";
 }else{
    diplay();
 }   
};