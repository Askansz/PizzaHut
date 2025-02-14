// Pizza Data
const pizzas = [
    {
        id: 1,
        name: "Margherita",
        price: 12.99,
        image: "https://source.unsplash.com/300x300/?pizza,margherita",
        description: "Fresh tomatoes, mozzarella, basil, and extra virgin olive oil"
    },
    {
        id: 2,
        name: "Pepperoni",
        price: 14.99,
        image: "https://source.unsplash.com/300x300/?pizza,pepperoni",
        description: "Classic pepperoni with melted mozzarella and tomato sauce"
    },
    {
        id: 3,
        name: "Vegetarian",
        price: 13.99,
        image: "https://source.unsplash.com/300x300/?pizza,vegetarian",
        description: "Bell peppers, mushrooms, onions, olives, and fresh tomatoes"
    },
    {
        id: 4,
        name: "BBQ Chicken",
        price: 15.99,
        image: "https://source.unsplash.com/300x300/?pizza,bbq",
        description: "Grilled chicken, BBQ sauce, red onions, and cilantro"
    }
];

let cart = [];

// Main Page Functions
function initializeWebsite() {
    if (document.getElementById('pizza-container')) {
        displayPizzas();
        setupEventListeners();
        loadCartFromStorage();
    } else if (document.querySelector('.checkout-container')) {
        initializeCheckout();
    }
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function displayPizzas() {
    const container = document.getElementById('pizza-container');
    container.innerHTML = pizzas.map(pizza => `
        <div class="pizza-card">
            <img src="${pizza.image}" alt="${pizza.name}">
            <h3>${pizza.name}</h3>
            <p>${pizza.description}</p>
            <div class="price">$${pizza.price}</div>
            <button onclick="addToCart(${pizza.id})">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(pizzaId) {
    const pizza = pizzas.find(p => p.id === pizzaId);
    cart.push(pizza);
    updateCartCount();
    showAddedToCartMessage(pizza.name);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showAddedToCartMessage(pizzaName) {
    const message = document.createElement('div');
    message.className = 'added-to-cart-message';
    message.textContent = `${pizzaName} added to cart!`;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const overlay = document.getElementById('overlay');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    overlay.classList.toggle('active');
    if (modal.style.display === 'block') {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${cart.indexOf(item)})">×</button>
        </div>
    `).join('');
    
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function proceedToCheckout() {
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    }
}

// Checkout Page Functions
function initializeCheckout() {
    loadCheckoutItems();
    setupFormListeners();
    setupInputFormatting();
}

function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    updateCheckoutTotals(cart);
}

function updateCheckoutTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const delivery = 5.00;
    const total = subtotal + delivery;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `$${delivery.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function setupFormListeners() {
    const forms = {
        'details-form': 'delivery-step',
        'delivery-form': 'payment-step',
        'payment-form': 'confirm-step'
    };

    Object.entries(forms).forEach(([formId, nextStep]) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                moveToNextStep(nextStep);
            });
        }
    });
}

function moveToNextStep(nextStepId) {
    const steps = document.querySelectorAll('.step');
    const currentActive = document.querySelector('.step-content.active');
    const nextStep = document.getElementById(nextStepId);

    currentActive.classList.remove('active');
    nextStep.classList.add('active');

    const nextStepIndex = Array.from(document.querySelectorAll('.step-content'))
        .indexOf(nextStep);
    
    steps.forEach((step, index) => {
        if (index <= nextStepIndex) {
            step.classList.add('active');
        }
    });

    if (nextStepId === 'confirm-step') {
        generateOrderConfirmation();
    }
}

function setupInputFormatting() {
    const cardNumber = document.getElementById('card-number');
    const expDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            e.target.value = value;
        });
    }

    if (expDate) {
        expDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cvv) {
        cvv.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3);
            e.target.value = value;
        });
    }
}

function generateOrderConfirmation() {
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('order-number').textContent = orderNumber;
    localStorage.removeItem('cart');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeWebsite);
