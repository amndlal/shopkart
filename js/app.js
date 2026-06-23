/* ============================================================
   app.js — storefront UI: routing, rendering, cart, wishlist
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

let activeCategory = 'All';
let searchTerm = '';

function money(n) { return Store.settings.currency + Number(n).toLocaleString('en-IN'); }
function discount(price, mrp) { return mrp > price ? Math.round((1 - price / mrp) * 100) : 0; }

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- theming + branding ---------- */
function applyBranding() {
  const s = Store.settings;
  document.documentElement.style.setProperty('--blue', s.themeColor);
  $('#logoMain').textContent = s.storeName;
  $('#footerText').textContent = s.footer;
  document.title = s.storeName;
  // derive a slightly darker shade for hovers
  $('header').style.background = s.themeColor;
}

/* ---------- category bar ---------- */
function renderCatbar() {
  const bar = $('#catbar');
  const cats = ['All', ...Store.categories];
  bar.innerHTML = cats.map(c =>
    `<button class="${c === activeCategory ? 'active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
  $$('#catbar button').forEach(b => b.onclick = () => {
    activeCategory = b.dataset.cat;
    searchTerm = '';
    $('#searchInput').value = '';
    renderHome();
  });
}

/* ---------- HOME / LISTING ---------- */
function filteredProducts() {
  return Store.products.filter(p => {
    const okCat = activeCategory === 'All' || p.category === activeCategory;
    const okSearch = !searchTerm ||
      (p.title + p.brand + p.category).toLowerCase().includes(searchTerm.toLowerCase());
    return okCat && okSearch;
  });
}

function productCard(p) {
  const off = discount(p.price, p.mrp);
  return `<div class="card" data-id="${p.id}">
    <button class="wish-heart ${Store.inWishlist(p.id) ? 'on' : ''}" data-wish="${p.id}">&#9829;</button>
    <div class="card-img" data-open="${p.id}"><img src="${p.img}" alt="${p.title}"></div>
    <div class="card-body">
      <span class="card-brand">${p.brand || ''}</span>
      <span class="card-title" data-open="${p.id}">${p.title}</span>
      ${p.rating ? `<span class="rating">${p.rating} &#9733;</span>` : ''}
      <div class="price-row">
        <span class="price">${money(p.price)}</span>
        ${off ? `<span class="mrp">${money(p.mrp)}</span><span class="off">${off}% off</span>` : ''}
      </div>
      <div class="card-actions">
        <button class="btn-primary" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

function renderHome() {
  renderCatbar();
  const s = Store.settings;
  const list = filteredProducts();
  const heading = searchTerm ? `Results for "${searchTerm}"`
    : activeCategory === 'All' ? 'Top Deals For You' : activeCategory;

  $('#view').innerHTML = `
    ${activeCategory === 'All' && !searchTerm ? `
      <div class="banner">
        <h2>${s.tagline}</h2>
        <p>${s.bannerText}</p>
      </div>` : ''}
    <h2 class="section-title">${heading}</h2>
    ${list.length ? `<div class="grid">${list.map(productCard).join('')}</div>`
      : `<div class="empty">No products found.</div>`}
  `;
  bindCardEvents();
}

function bindCardEvents() {
  $$('[data-add]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    Store.addToCart(b.dataset.add);
    refreshCartBadge();
    toast('Added to cart');
  });
  $$('[data-open]').forEach(el => el.onclick = () => renderProduct(el.dataset.open));
  $$('[data-wish]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    Store.toggleWishlist(b.dataset.wish);
    b.classList.toggle('on');
    toast(Store.inWishlist(b.dataset.wish) ? 'Saved to wishlist' : 'Removed from wishlist');
  });
}

/* ---------- PRODUCT DETAIL ---------- */
function renderProduct(id) {
  const p = Store.getProduct(id);
  if (!p) return renderHome();
  const off = discount(p.price, p.mrp);
  window.scrollTo(0, 0);
  $('#view').innerHTML = `
    <button class="btn-outline" id="backBtn">&larr; Back</button>
    <div class="pd" style="margin-top:12px">
      <div class="pd-img"><img src="${p.img}" alt="${p.title}"></div>
      <div>
        <span class="card-brand">${p.brand || ''}</span>
        <h1>${p.title}</h1>
        ${p.rating ? `<span class="rating">${p.rating} &#9733;</span>` : ''}
        <div class="price-row" style="margin:12px 0">
          <span class="price">${money(p.price)}</span>
          ${off ? `<span class="mrp">${money(p.mrp)}</span><span class="off">${off}% off</span>` : ''}
        </div>
        <span class="tag">${p.category}</span>
        <p class="pd-desc">${p.desc || ''}</p>
        <div class="pd-actions">
          <button class="btn-primary" id="pdAdd">Add to Cart</button>
          <button class="btn-blue" id="pdBuy">Buy Now</button>
        </div>
      </div>
    </div>`;
  $('#backBtn').onclick = renderHome;
  $('#pdAdd').onclick = () => { Store.addToCart(id); refreshCartBadge(); toast('Added to cart'); };
  $('#pdBuy').onclick = () => { Store.addToCart(id); refreshCartBadge(); openCart(); };
}

/* ---------- WISHLIST PAGE ---------- */
function renderWishlist() {
  const items = Store.wishlist.map(id => Store.getProduct(id)).filter(Boolean);
  $('#view').innerHTML = `
    <button class="btn-outline" id="backBtn">&larr; Back</button>
    <h2 class="section-title">My Wishlist</h2>
    ${items.length ? `<div class="grid">${items.map(productCard).join('')}</div>`
      : `<div class="empty">Your wishlist is empty.</div>`}`;
  $('#backBtn').onclick = renderHome;
  bindCardEvents();
}

/* ---------- ORDERS PAGE ---------- */
function renderOrders() {
  const orders = Store.orders;
  $('#view').innerHTML = `
    <button class="btn-outline" id="backBtn">&larr; Back</button>
    <h2 class="section-title">My Orders</h2>
    ${orders.length ? orders.map(o => `
      <div class="order">
        <div class="order-head">
          <span><strong>${o.id}</strong> &middot; ${new Date(o.date).toLocaleDateString()}</span>
          <span class="order-status">${o.status}</span>
        </div>
        ${o.items.map(i => `<div>${i.qty} × ${i.title} — ${money(i.price * i.qty)}</div>`).join('')}
        <div style="margin-top:8px"><strong>Total: ${money(o.total)}</strong></div>
      </div>`).join('')
      : `<div class="empty">No orders yet.</div>`}`;
  $('#backBtn').onclick = renderHome;
}

/* ---------- CART DRAWER ---------- */
function refreshCartBadge() { $('#cartBadge').textContent = Store.cartCount(); }

function renderCart() {
  const body = $('#cartItems');
  if (!Store.cart.length) {
    body.innerHTML = `<div class="empty">Your cart is empty.</div>`;
  } else {
    body.innerHTML = Store.cart.map(c => {
      const p = Store.getProduct(c.id);
      if (!p) return '';
      return `<div class="cart-line">
        <img src="${p.img}" alt="">
        <div class="info">
          <div>${p.title}</div>
          <strong>${money(p.price)}</strong>
          <div class="qty">
            <button data-dec="${c.id}">−</button>
            <span>${c.qty}</span>
            <button data-inc="${c.id}">+</button>
            <button data-rm="${c.id}" style="margin-left:auto;color:#e53935">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }
  $('#cartTotal').textContent = money(Store.cartTotal());
  $$('[data-inc]').forEach(b => b.onclick = () => { Store.addToCart(b.dataset.inc); afterCartChange(); });
  $$('[data-dec]').forEach(b => b.onclick = () => {
    const line = Store.cart.find(c => c.id === b.dataset.dec);
    Store.setQty(b.dataset.dec, line.qty - 1); afterCartChange();
  });
  $$('[data-rm]').forEach(b => b.onclick = () => { Store.setQty(b.dataset.rm, 0); afterCartChange(); });
}
function afterCartChange() { renderCart(); refreshCartBadge(); }

function openCart() { renderCart(); $('#cartDrawer').classList.add('open'); $('#drawerOverlay').classList.add('open'); }
function closeCart() { $('#cartDrawer').classList.remove('open'); $('#drawerOverlay').classList.remove('open'); }

/* ---------- HEADER WIRING ---------- */
function initHeader() {
  $('#logoBtn').onclick = e => { e.preventDefault(); activeCategory = 'All'; searchTerm = ''; renderHome(); };
  $('#cartBtn').onclick = openCart;
  $('#closeCart').onclick = closeCart;
  $('#drawerOverlay').onclick = closeCart;
  $('#wishlistBtn').onclick = renderWishlist;
  $('#adminBtn').onclick = () => Admin.render();
  $('#searchForm').onsubmit = e => {
    e.preventDefault();
    searchTerm = $('#searchInput').value.trim();
    activeCategory = 'All';
    renderHome();
  };
  $('#checkoutBtn').onclick = () => {
    const order = Store.placeOrder();
    if (!order) { toast('Your cart is empty'); return; }
    closeCart();
    refreshCartBadge();
    renderOrders();
    toast('Order placed successfully!');
  };
}

/* ---------- BOOT ---------- */
function boot() {
  Store.load();
  applyBranding();
  initHeader();
  refreshCartBadge();
  renderHome();
}
document.addEventListener('DOMContentLoaded', boot);
