document.addEventListener('DOMContentLoaded', () => {
    initializeCheckout();
});

function initializeCheckout() {
    loadCartItems();
    setupFormListeners();
    setupInputFormatting();
}

function loadCartItems() {
    // Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
            </div>
        </div>
    `).join('');

    updateTotals(cart);
}

function updateTotals(cart) {
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
        document.getElementById(formId).addEventListener('submit', (e) => {
            e.preventDefault();
            moveToNextStep(nextStep);
        });
    });
}

function moveToNextStep(nextStepId) {
    // Update progress bar
    const steps = document.querySelectorAll('.step');
    const currentActive = document.querySelector('.step-content.active');
    const nextStep = document.getElementById(nextStepId);

    currentActive.classList.remove('active');
    nextStep.classList.add('active');

    // Update progress indicators
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

function generateOrderConfirmation() {
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('order-number').textContent = orderNumber;
    
    // Clear cart from localStorage
    localStorage.removeItem('cart');
}

function setupInputFormatting() {
    // Card number formatting
    document.getElementById('card-number').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        e.target.value = value;
    });

    // Expiry date formatting
    document.getElementById('expiry-date').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // CVV formatting
    document.getElementById('cvv').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        e.target.value = value;
    });
}
