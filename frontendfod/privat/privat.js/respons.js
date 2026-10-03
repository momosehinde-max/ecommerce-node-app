import { marv } from './prodotdat.js';
import { naira } from '/jsfol/fmt.js';

let numb = -1;

// show a short message without disturbing the page
function note(message) {
    if (typeof window.gDialog === 'function') {
        window.gDialog({
            type: 'error',
            title: 'Hold on',
            message: message,
            actions: [{ label: 'OK', variant: 'text' }]
        });
    } else {
        alert(message);
    }
}

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

        // a picture is needed, otherwise the server has nothing to save
        if (!image.files[0]) {
            return note('Please choose a picture for the product');
        }

        if (!name || price === '') {
            return note('Please give the product a name and a price');
        }

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

            if (!response.ok) {
                return note(data.masage || 'Could not save the product');
            }

            await show();

            clearForm();

        } catch (error) {

            console.log(error);

            note('Could not reach the server, please try again');

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

            if (!response.ok) {
                return note(data.message || 'Could not update the product');
            }

            await show();

            clearForm();

            addButton.innerHTML = 'add';

            numb = -1;

        } catch (error) {

            console.log(error);

            note('Could not reach the server, please try again');

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

                        <p>${naira(product.price)}</p>

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

        if (!response.ok) {
            return note(data.message || 'Could not delete the product');
        }

        // Wait until delete finishes
        // before getting products again.

        await show();

    } catch (error) {

        console.log(error);

        note('Could not reach the server, please try again');

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



