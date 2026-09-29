function prodoct(id) {

    let show = '';

    // Get customer's orders
    
    fetch(`http://localhost:3500/prodot/${id}`, {
        method: 'GET'
    })
    .then((respo) => {
        return respo.json();
    })
    .then((orders) => {

        console.log('Customer order:', orders);

        // Get all products

        return fetch('http://localhost:3500/prodot');
    })
    .then((res) => {
        return res.json();
    })
    .then((products) => {

        console.log('All products:', products);

        // Go through each customer's order

        orders.forEach((order) => {

            // Go through products inside the order

            order.mare.forEach((item) => {

                // Find the actual product

                const product = products.find((pro) => {
                    return pro._id === item.id;
                });


                if (product) {

                    show += `
                        <div class="gen">

                            <div class="fest">

                                <p class="infor">
                                    Name: ${product.Name}
                                </p>

                                <p class="infor">
                                    Price: ${product.price}
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

        // Display everything

        document.querySelector('.marv').innerHTML = show;

    })
    .catch((error) => {
        console.log('Error:', error);
    });

};