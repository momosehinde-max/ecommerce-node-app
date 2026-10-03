// money display helper (same output as /jsfol/fmt.js)
function naira(value) {
    const n = Number(value);
    if (!isFinite(n) || value === null || value === undefined || value === '') return '—';
    return '₦' + n.toLocaleString('en-NG');
}

function prodoct(id) {

    let show = '';

    // Get customer's orders
    
    fetch(`/prodot/${id}`, {
        method: 'GET'
    })
    .then((respo) => {
        return respo.json();
    })
    .then((orders) => {

        console.log('Customer order:', orders);

        // the server answers {message:'no alder'} when there is nothing yet
        if (!Array.isArray(orders)) orders = [];

        // Get all products

        return fetch('/prodot');
    })
    .then((res) => {
        return res.json();
    })
    .then((products) => {

        console.log('All products:', products);

        // Go through each customer's order

        orders.forEach((order) => {

            // Go through products inside the order

            (order.mare || []).forEach((item) => {

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

        // Display everything

        document.querySelector('.marv').innerHTML = show;

    })
    .catch((error) => {
        console.log('Error:', error);
    });

};