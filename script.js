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

function initializeWebsite() {
    displayPizzas();
    setupEventListeners();
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
}

function showAddedToCartMessage(pizzaName) {
    const message = document.createElement('div');
    message.className = 'added-to-cart-message';
    message.textContent = `${pizzaName} added to cart!`;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
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
                <p>$${item.price}</p>
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
    updateCartCount();
    updateCartDisplay();
}

function setupEventListeners() {
    document.getElementById('overlay').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('overlay').classList.remove('active');
    });
}

window.addEventListener('load', initializeWebsite);
