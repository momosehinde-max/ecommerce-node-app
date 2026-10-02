
// DISPLAY CUSTOMERS

let goback = 1;


async function diplay() {

    try {

        const response = await fetch(
            '/acunte',
            {
                method: 'GET'
            }
        );

        const customers = await response.json();

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

        goback = 1;


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


        orders.forEach((order) => {

            order.mare.forEach((item) => {

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
                                    Price: ₦${product.price}
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

         goback = 2;


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