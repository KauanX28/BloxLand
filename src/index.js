// App State
const state = {
  products: [],
  reviews: [],
  faq: [],
  cart: JSON.parse(localStorage.getItem('bloxkeys_cart')) || [],
  isPromoOpen: true, // Show promo on load
};

// DOM Elements
const els = {
  promoModal: document.getElementById('promo-modal'),
  closePromo: document.getElementById('close-promo'),
  gotItBtn: document.getElementById('got-it-btn'),
  copyCodeBtn: document.getElementById('copy-code-btn'),
  
  cartToggle: document.getElementById('cart-toggle'),
  cartCount: document.getElementById('cart-count'),
  cartOverlay: document.getElementById('cart-overlay'),
  closeCart: document.getElementById('close-cart'),
  cartItemsContainer: document.getElementById('cart-items-container'),
  emptyCartMessage: document.getElementById('empty-cart-message'),
  cartFooter: document.getElementById('cart-footer'),
  
  summaryItems: document.getElementById('summary-items'),
  summaryQty: document.getElementById('summary-qty'),
  summaryTotal: document.getElementById('summary-total'),
  
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  mobileMenu: document.getElementById('mobile-menu'),
  closeMobileMenu: document.getElementById('close-mobile-menu'),
  mobileCartBtn: document.getElementById('mobile-cart-btn'),
  
  productsContainer: document.getElementById('products-container'),
  reviewsContainer: document.getElementById('reviews-container'),
  faqContainer: document.getElementById('faq-container'),
  continueShoppingBtn: document.getElementById('continue-shopping-btn')
};

// Initialize
async function init() {
  setupEventListeners();
  await fetchProducts();
  await fetchReviews();
  await fetchFAQ();
  
  renderProducts();
  renderReviews();
  renderFAQ();
  updateCartUI();
  setupScrollAnimations();
  
  // Show promo if not dismissed previously
  if (localStorage.getItem('bloxkeys_promo_dismissed')) {
    els.promoModal.classList.add('hidden');
  } else {
    els.promoModal.classList.remove('hidden');
  }
}

// Event Listeners
function setupEventListeners() {
  // Promo Modal
  els.closePromo.addEventListener('click', closePromo);
  els.gotItBtn.addEventListener('click', closePromo);
  els.copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('WAVYSPRING');
    const originalText = els.copyCodeBtn.innerHTML;
    els.copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      els.copyCodeBtn.innerHTML = originalText;
    }, 2000);
  });

  // Mobile Menu
  els.mobileMenuBtn.addEventListener('click', () => els.mobileMenu.classList.remove('hidden'));
  els.closeMobileMenu.addEventListener('click', () => els.mobileMenu.classList.add('hidden'));
  
  // Cart
  els.cartToggle.addEventListener('click', openCart);
  els.mobileCartBtn.addEventListener('click', () => {
    els.mobileMenu.classList.add('hidden');
    openCart();
  });
  els.closeCart.addEventListener('click', closeCart);
  els.continueShoppingBtn.addEventListener('click', closeCart);
}

function closePromo() {
  els.promoModal.classList.add('hidden');
  localStorage.setItem('bloxkeys_promo_dismissed', 'true');
}

function openCart() {
  els.cartOverlay.classList.remove('hidden');
}

function closeCart() {
  els.cartOverlay.classList.add('hidden');
}

// Fetch Data
async function fetchProducts() {
  try {
    const res = await fetch('./src/data/products.json');
    state.products = await res.json();
  } catch (err) {
    console.error('Failed to fetch products', err);
    state.products = [];
  }
}

async function fetchReviews() {
  try {
    const res = await fetch('./src/data/reviews.json');
    state.reviews = await res.json();
  } catch (err) {
    console.error('Failed to fetch reviews', err);
    state.reviews = [];
  }
}

async function fetchFAQ() {
  try {
    const res = await fetch('./src/data/faq.json');
    state.faq = await res.json();
  } catch (err) {
    console.error('Failed to fetch FAQ', err);
    state.faq = [];
  }
}

// Render Products
function renderProducts() {
  if (!state.products || state.products.length === 0) return;
  
  els.productsContainer.innerHTML = state.products.map(product => {
    // Generate variants HTML
    const variantsHtml = product.variants ? product.variants.map(v => `
      <div class="variant-card">
        <div class="variant-header">
          <span class="variant-title">${v.name}</span>
          ${v.badge ? `<span class="variant-badge">${v.badge}</span>` : ''}
        </div>
        <div class="variant-duration">${v.duration}</div>
        <div class="variant-price">$${v.price.toFixed(2)}</div>
        <p class="variant-desc">License with selected access time.</p>
        <div class="variant-features">
          ${v.features.map(f => `<div class="variant-feature"><i class="fa-solid fa-check"></i> ${f}</div>`).join('')}
        </div>
        <button class="add-to-cart-btn" onclick="window.addToCart('${product.id}', '${v.id}')">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `).join('') : '';

    return `
      <div class="product-card">
        ${product.badge ? `<div class="badge ${product.badge === 'BACK UP' ? 'back-up' : ''}">${product.badge}</div>` : ''}
        <div class="product-image-container" style="background-image: url('${product.image}'); background-color: var(--bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <!-- Fallback if image URL is invalid, using CSS gradient instead for styling -->
          <div style="background: linear-gradient(45deg, #0f172a, #1e3a8a); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
             <span style="font-size: 64px; opacity: 0.5;">
                <i class="fa-solid fa-box"></i>
             </span>
          </div>
        </div>
        <div class="product-content">
          <h2 class="product-title">${product.name}</h2>
          <p class="product-desc">${product.description}</p>
          
          <div class="product-rating">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star${product.rating < 5 ? '-half-stroke' : ''}"></i>
            </div>
            <span class="rating-score">${product.rating}</span>
            <span class="review-count">(${product.reviews_count} reviews)</span>
          </div>
          
          <div class="key-features">
            <div class="key-features-title">KEY FEATURES:</div>
            <div class="features-grid">
              ${product.features.map(f => `<div class="feature-item">${f}</div>`).join('')}
            </div>
          </div>
          
          <div class="variants-container">
            ${variantsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Cart Logic
window.addToCart = function(productId, variantId) {
  const product = state.products.find(p => p.id == productId);
  if (!product) return;
  
  const variant = product.variants.find(v => v.id == variantId);
  if (!variant) return;

  const existingItem = state.cart.find(item => item.variantId === variantId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push({
      productId: product.id,
      variantId: variant.id,
      name: variant.name,
      price: variant.price,
      qty: 1
    });
  }
  
  saveCart();
  updateCartUI();
  openCart();
};

window.updateQty = function(variantId, change) {
  const item = state.cart.find(i => i.variantId === variantId);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      window.removeFromCart(variantId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
};

window.removeFromCart = function(variantId) {
  state.cart = state.cart.filter(i => i.variantId !== variantId);
  saveCart();
  updateCartUI();
};

function saveCart() {
  localStorage.setItem('bloxkeys_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const totalItems = state.cart.length;
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  
  // Update badge
  if (totalQty > 0) {
    els.cartCount.textContent = totalQty;
    els.cartCount.classList.remove('hidden');
  } else {
    els.cartCount.classList.add('hidden');
  }
  
  // Render cart items
  const itemsHtml = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <i class="fa-solid fa-key" style="font-size: 24px; color: var(--blue-primary);"></i>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="window.updateQty('${item.variantId}', -1)"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="window.updateQty('${item.variantId}', 1)"><i class="fa-solid fa-plus"></i></button>
          </div>
          <button class="remove-btn" onclick="window.removeFromCart('${item.variantId}')"><i class="fa-regular fa-trash-can"></i></button>
        </div>
      </div>
    </div>
  `).join('');

  if (state.cart.length === 0) {
    els.cartItemsContainer.innerHTML = '';
    els.cartItemsContainer.appendChild(els.emptyCartMessage);
    els.emptyCartMessage.classList.remove('hidden');
    els.cartFooter.classList.add('hidden');
  } else {
    els.cartItemsContainer.innerHTML = itemsHtml;
    els.cartFooter.classList.remove('hidden');
    
    // Update summary
    els.summaryItems.textContent = totalItems;
    els.summaryQty.textContent = totalQty;
    // Calculate total price based on item price * qty
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    els.summaryTotal.textContent = '$' + totalPrice.toFixed(2);
  }
}

// Render Reviews
function renderReviews() {
  if (!state.reviews || !els.reviewsContainer) return;
  els.reviewsContainer.innerHTML = state.reviews.map(review => {
    const stars = Array(5).fill(0).map((_, i) => 
      `<i class="fa-solid fa-star" style="${i < review.rating ? '' : 'opacity: 0.3'}"></i>`
    ).join('');
    
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <h4>${review.name}</h4>
            <div class="review-stars">${stars}</div>
          </div>
          <span class="review-date">${review.date}</span>
        </div>
        <p class="review-content">"${review.content}"</p>
        <div class="review-product">
          <i class="fa-solid fa-box-open"></i> ${review.product}
        </div>
      </div>
    `;
  }).join('');
}

// Render FAQ
function renderFAQ() {
  if (!state.faq || !els.faqContainer) return;
  els.faqContainer.innerHTML = state.faq.map(item => `
    <div class="faq-item">
      <div class="faq-question">
        <span>${item.question}</span>
        <i class="fa-solid fa-chevron-down faq-icon"></i>
      </div>
      <div class="faq-answer">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('');

  // Add click listeners for accordion
  const faqItems = els.faqContainer.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      // Toggle clicked
      if (!isActive) item.classList.add('active');
    });
  });
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(el => observer.observe(el));
}

// Start app
document.addEventListener('DOMContentLoaded', init);
