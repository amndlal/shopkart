/* ============================================================
   store.js — central state + localStorage persistence
   Everything lives in one object under one localStorage key so
   the whole catalog can be exported/imported as a single file.
   ============================================================ */
const KEY = 'shopkart_v1';

const Store = {
  state: null,

  load() {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { this.state = JSON.parse(raw); }
      catch { this.state = null; }
    }
    if (!this.state) {
      // First run — seed with defaults from data.js
      this.state = structuredClone(DEFAULT_DATA);
      this.save();
    }
    // Make sure newer fields exist if upgrading from an old save
    this.state.settings ||= structuredClone(DEFAULT_DATA.settings);
    this.state.cart ||= [];
    this.state.wishlist ||= [];
    this.state.orders ||= [];
    return this.state;
  },

  save() { localStorage.setItem(KEY, JSON.stringify(this.state)); },

  // ---- settings ----
  get settings() { return this.state.settings; },
  updateSettings(patch) { Object.assign(this.state.settings, patch); this.save(); },

  // ---- products ----
  get products() { return this.state.products; },
  getProduct(id) { return this.state.products.find(p => p.id === id); },
  addProduct(p) {
    p.id = 'p' + Date.now();
    this.state.products.unshift(p);
    this.save();
    return p;
  },
  updateProduct(id, patch) {
    const p = this.getProduct(id);
    if (p) { Object.assign(p, patch); this.save(); }
    return p;
  },
  deleteProduct(id) {
    this.state.products = this.state.products.filter(p => p.id !== id);
    this.state.cart = this.state.cart.filter(c => c.id !== id);
    this.state.wishlist = this.state.wishlist.filter(w => w !== id);
    this.save();
  },

  // ---- categories ----
  get categories() { return this.state.categories; },
  addCategory(name) {
    if (name && !this.state.categories.includes(name)) {
      this.state.categories.push(name);
      this.save();
    }
  },
  deleteCategory(name) {
    this.state.categories = this.state.categories.filter(c => c !== name);
    this.save();
  },

  // ---- cart ----
  get cart() { return this.state.cart; },
  cartCount() { return this.state.cart.reduce((n, c) => n + c.qty, 0); },
  cartTotal() {
    return this.state.cart.reduce((sum, c) => {
      const p = this.getProduct(c.id);
      return sum + (p ? p.price * c.qty : 0);
    }, 0);
  },
  addToCart(id, qty = 1) {
    const line = this.state.cart.find(c => c.id === id);
    if (line) line.qty += qty;
    else this.state.cart.push({ id, qty });
    this.save();
  },
  setQty(id, qty) {
    const line = this.state.cart.find(c => c.id === id);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) this.state.cart = this.state.cart.filter(c => c.id !== id);
    this.save();
  },
  clearCart() { this.state.cart = []; this.save(); },

  // ---- wishlist ----
  get wishlist() { return this.state.wishlist; },
  inWishlist(id) { return this.state.wishlist.includes(id); },
  toggleWishlist(id) {
    if (this.inWishlist(id)) this.state.wishlist = this.state.wishlist.filter(w => w !== id);
    else this.state.wishlist.push(id);
    this.save();
  },

  // ---- orders ----
  get orders() { return this.state.orders; },
  placeOrder() {
    if (!this.state.cart.length) return null;
    const order = {
      id: 'ORD' + Date.now(),
      date: new Date().toISOString(),
      total: this.cartTotal(),
      items: this.state.cart.map(c => {
        const p = this.getProduct(c.id);
        return { title: p?.title || 'Item', qty: c.qty, price: p?.price || 0 };
      }),
      status: 'Confirmed',
    };
    this.state.orders.unshift(order);
    this.clearCart();
    this.save();
    return order;
  },

  // ---- import / export ----
  exportData() { return JSON.stringify(this.state, null, 2); },
  importData(json) {
    const data = JSON.parse(json);
    if (!data.products || !data.settings) throw new Error('Invalid backup file');
    this.state = data;
    this.save();
  },
  resetAll() {
    this.state = structuredClone(DEFAULT_DATA);
    this.save();
  },
};
