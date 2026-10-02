import { marv } from './prodotdat.js';

let numb = -1;

// GET ELEMENTS

const image = document.querySelector('.shus');
const display = document.querySelector('.show');
const addButton = document.querySelector('.add');
const nameInput = document.querySelector('.name');
const priceInput = document.querySelector('.price');
const productContainer = document.querySelector('.rice');
const userButton = document.querySelector('.user');


// IMAGE PREVIEW

image.addEventListener('change', () => {

    if (image.files[0]) {
        display.src = URL.createObjectURL(image.files[0]);
    }

});


// ADD / EDIT BUTTON

addButton.addEventListener('click', add);


// ADD OR EDIT PRODUCT


async function add() {

    const name = nameInput.value;
    const price = priceInput.value;

    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);


    
    // ADD PRODUCT

    if (addButton.innerHTML === 'add') {

        formData.append('image', image.files[0]);

        try {

            const response = await fetch(
                '/prodot',
                {
                    method: 'POST',
                    body: formData
                }
            );

            const data = await response.json();

            console.log(data);

            await show();

            clearForm();

        } catch (error) {

            console.log(error);

        }

    }


    // EDIT PRODUCT
    

    else {

        

        if (image.files[0]) {
            formData.append('image', image.files[0]);
        }

        try {

            const response = await fetch(
                `/prodot/${numb}`,
                {
                    method: 'PUT',
                    body: formData
                }
            );

            const data = await response.json();

            console.log(data);

            await show();

            clearForm();

            addButton.innerHTML = 'add';

            numb = -1;

        } catch (error) {

            console.log(error);

        }

    }

}



// SHOW PRODUCTS


async function show() {

    try {

        const response = await fetch(
            '/prodot',
            {
                method: 'GET'
            }
        );

        const products = await response.json();


        // Update imported array

        marv.length = 0;
        marv.push(...products);


        console.log(marv);


        let html = '';


        marv.forEach((product) => {

            html += `
                <div>

                    <img 
                        src="${product.Image}" 
                        class="comeimg"
                    >

                    <div>

                        <p>${product.Name}</p>

                        <p>₦${product.price}</p>

                        <button 
                            class="deleteButton"
                            data-id="${product._id}"
                        >
                            DELET
                        </button>

                        <button 
                            class="editButton"
                            data-id="${product._id}"
                        >
                            EDIT
                        </button>

                    </div>

                </div>
            `;

        });


        productContainer.innerHTML = html;


    } catch (error) {

        console.log(error);

    }

}


// DELETE / EDIT BUTTONS


productContainer.addEventListener('click', (event) => {

    // DELETE

    if (event.target.classList.contains('deleteButton')) {

        const id = event.target.dataset.id;

        delet(id);

    }


    // EDIT

    if (event.target.classList.contains('editButton')) {

        const id = event.target.dataset.id;

        edit(id);

    }

});



// DELETE PRODUCT


async function delet(id) {

    try {

        const response = await fetch(
            `/prodot/${id}`,
            {
                method: 'DELETE'
            }
        );

        const data = await response.json();

        console.log(data);

        // Wait until delete finishes
        // before getting products again.

        await show();

    } catch (error) {

        console.log(error);

    }

}

// EDIT PRODUCT


function edit(id) {

    let selectedProduct;

    // Find product

    marv.forEach((product) => {

        if (product._id === id) {

            selectedProduct = product;

        }

    });


    

    if (selectedProduct) {

        nameInput.value = selectedProduct.Name;

        priceInput.value = selectedProduct.price;

    }


    

    addButton.innerHTML = 'edit';


  

    numb = id;

}



// CLEAR FORM

function clearForm() {

    nameInput.value = '';

    priceInput.value = '';

    image.value = '';

    display.src = '';

}



// USER BUTTON


userButton.addEventListener('click', () => {

    user();

});


function user() {

    document.location.href = '/user.html';

}


show();



