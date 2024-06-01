document.addEventListener('DOMContentLoaded', function() {
    const cartList = document.querySelector('.cart-list');
    const totalElement = document.getElementById('total');
    const checkoutButton = document.getElementById('checkout');
    const placeOrderButton = document.getElementById('place-order');
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCart() {
        const cart = getCart();
        if (cartList) {
            cartList.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartList.innerHTML = '<p>No items in cart</p>';
            } else {
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <h3>${item.product}</h3>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <button class="remove-from-cart" data-index="${index}">Remove From Cart</button>
                    `;
                    cartList.appendChild(cartItem);
                    total += item.price;
                });
            }

            totalElement.textContent = `${total.toFixed(2)}`;
        }
    }

    function showAlert(message, color) {
        const alertBox = document.createElement('div');
        alertBox.classList.add('alert');
        alertBox.textContent = message;
        alertBox.style.backgroundColor = color;
        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.classList.add('show');
        }, 10);

        setTimeout(() => {
            alertBox.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(alertBox);
            }, 500);
        }, 2000);
    }

    function validateInputs() {
        if (nameInput.value.trim() === '' || addressInput.value.trim() === '') {
            return false;
        }
        return true;
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            const cart = getCart();
            cart.push({ product, price });
            saveCart(cart);
            updateCart();
            showAlert(`${product} has been added to the cart.`, '#4caf50');
        });
    });

    if (cartList) {
        cartList.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-from-cart')) {
                const index = parseInt(event.target.dataset.index);
                const cart = getCart();
                const removedItem = cart.splice(index, 1)[0];
                saveCart(cart);
                updateCart();
                showAlert(`${removedItem.product} has been removed from the cart.`, '#f44336');
            }
        });

        updateCart();
    }

    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(event) {
            event.preventDefault();
    
            const cart = getCart();
            if (cart.length === 0) {
                showAlert('Your cart is empty. Please add items to proceed.', '#f44336');
                return;
            }
            if (!validateInputs()) {
                showAlert('Please fill in all required fields.', '#f44336');
                return;
            }
            localStorage.removeItem('cart');
            updateCart();
            showAlert('Your order has been placed. Thank you!', '#4caf50');
            nameInput.value = '';
            addressInput.value = '';
        });
    }
    

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
});
