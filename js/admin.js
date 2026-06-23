/* ============================================================
   admin.js — admin panel: manage products, categories,
   store settings, and export/import the whole catalog.
   ============================================================ */
const Admin = {
  editingId: null,

  render() {
    window.scrollTo(0, 0);
    const s = Store.settings;
    $('#view').innerHTML = `
      <div class="admin-head">
        <h2 class="section-title" style="margin:0">⚙️ Admin Panel</h2>
        <div class="admin-tools">
          <button class="btn-outline" id="aStore">View Store</button>
          <button class="btn-outline" id="aOrders">Orders (${Store.orders.length})</button>
          <button class="btn-outline" id="aExport">⬇ Export</button>
          <button class="btn-outline" id="aImport">⬆ Import</button>
          <button class="btn-danger" id="aReset">Reset All</button>
        </div>
      </div>

      <!-- STORE SETTINGS -->
      <div class="panel">
        <h3>Store Settings</h3>
        <div class="form-grid">
          <div class="field"><label>Store Name</label><input id="setName" value="${s.storeName}"></div>
          <div class="field"><label>Theme Color</label><input type="color" id="setColor" value="${s.themeColor}"></div>
          <div class="field full"><label>Banner Heading (tagline)</label><input id="setTag" value="${s.tagline}"></div>
          <div class="field full"><label>Banner Text</label><input id="setBanner" value="${s.bannerText}"></div>
          <div class="field"><label>Currency Symbol</label><input id="setCur" value="${s.currency}"></div>
          <div class="field"><label>Footer Text</label><input id="setFooter" value="${s.footer}"></div>
        </div>
        <button class="btn-blue mini" style="margin-top:12px" id="saveSettings">Save Settings</button>
      </div>

      <!-- HERO CAROUSEL -->
      <div class="panel">
        <h3>Hero Carousel Slides</h3>
        <div style="overflow-x:auto">
          <table class="admin-table">
            <thead><tr><th>Img</th><th>Heading</th><th>Text</th><th>Links to</th><th>Actions</th></tr></thead>
            <tbody id="slideRows"></tbody>
          </table>
        </div>
        <h3 style="margin-top:18px;font-size:14px" id="slideFormTitle">Add New Slide</h3>
        <div class="form-grid">
          <div class="field"><label>Heading</label><input id="sHeading"></div>
          <div class="field"><label>Text</label><input id="sText"></div>
          <div class="field"><label>Links to category (optional)</label><select id="sLink"></select></div>
          <div class="field"><label>Image</label>
            <input id="sImgUrl" placeholder="Paste image URL">
            <input id="sImgFile" type="file" accept="image/*" style="margin-top:6px">
          </div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
          <button class="btn-blue mini" id="saveSlide">Save Slide</button>
          <button class="btn-outline mini" id="cancelSlide" style="display:none">Cancel</button>
          <span id="sPreviewWrap" style="margin-left:auto"></span>
        </div>
      </div>

      <!-- CATEGORIES -->
      <div class="panel">
        <h3>Categories</h3>
        <div id="catList" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"></div>
        <div style="display:flex;gap:8px">
          <input id="newCat" placeholder="New category name" class="field" style="padding:9px 10px;border:1px solid var(--line);border-radius:4px">
          <button class="btn-blue mini" id="addCat">Add</button>
        </div>
      </div>

      <!-- ADD / EDIT PRODUCT -->
      <div class="panel">
        <h3 id="formTitle">Add New Product</h3>
        <div class="form-grid">
          <div class="field"><label>Title</label><input id="pTitle"></div>
          <div class="field"><label>Brand</label><input id="pBrand"></div>
          <div class="field"><label>Category</label><select id="pCat"></select></div>
          <div class="field"><label>Rating (0–5)</label><input id="pRating" type="number" step="0.1" min="0" max="5"></div>
          <div class="field"><label>Price</label><input id="pPrice" type="number" min="0"></div>
          <div class="field"><label>MRP (original price)</label><input id="pMrp" type="number" min="0"></div>
          <div class="field full"><label>Image</label>
            <input id="pImgUrl" placeholder="Paste image URL, or upload a file below">
            <input id="pImgFile" type="file" accept="image/*" style="margin-top:6px">
          </div>
          <div class="field full"><label>Description</label><textarea id="pDesc"></textarea></div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn-primary mini" id="saveProduct">Save Product</button>
          <button class="btn-outline mini" id="cancelEdit" style="display:none">Cancel</button>
          <span id="imgPreviewWrap" style="margin-left:auto"></span>
        </div>
      </div>

      <!-- PRODUCT TABLE -->
      <div class="panel">
        <h3>All Products (${Store.products.length})</h3>
        <div style="overflow-x:auto">
          <table class="admin-table">
            <thead><tr><th>Img</th><th>Title</th><th>Category</th><th>Price</th><th>MRP</th><th>Actions</th></tr></thead>
            <tbody id="prodRows"></tbody>
          </table>
        </div>
      </div>

      <input type="file" id="importFile" accept="application/json" style="display:none">
    `;
    this.bind();
    this.renderCats();
    this.renderCatSelect();
    this.renderSlideLinkSelect();
    this.renderSlideRows();
    this.renderRows();
    this.resetForm();
    this.resetSlideForm();
  },

  bind() {
    $('#aStore').onclick = renderHome;
    $('#aOrders').onclick = renderOrders;
    $('#saveSettings').onclick = () => this.saveSettings();
    $('#addCat').onclick = () => this.addCat();
    $('#saveProduct').onclick = () => this.saveProduct();
    $('#cancelEdit').onclick = () => this.resetForm();
    $('#aExport').onclick = () => this.exportData();
    $('#aImport').onclick = () => $('#importFile').click();
    $('#importFile').onchange = e => this.importData(e);
    $('#aReset').onclick = () => this.resetAll();

    // image: URL field live preview
    $('#pImgUrl').oninput = () => this.previewImg($('#pImgUrl').value);
    // image: file upload → base64 (stored offline, no hosting needed)
    $('#pImgFile').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { $('#pImgUrl').value = reader.result; this.previewImg(reader.result); };
      reader.readAsDataURL(file);
    };

    // ---- slide form ----
    $('#saveSlide').onclick = () => this.saveSlide();
    $('#cancelSlide').onclick = () => this.resetSlideForm();
    $('#sImgUrl').oninput = () => this.previewSlideImg($('#sImgUrl').value);
    $('#sImgFile').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { $('#sImgUrl').value = reader.result; this.previewSlideImg(reader.result); };
      reader.readAsDataURL(file);
    };
  },

  /* ---- carousel slides ---- */
  editingSlide: null,

  renderSlideLinkSelect() {
    $('#sLink').innerHTML = `<option value="">— none —</option>` +
      Store.categories.map(c => `<option value="${c}">${c}</option>`).join('');
  },

  renderSlideRows() {
    $('#slideRows').innerHTML = Store.slides.map((sl, i) => `
      <tr>
        <td><img src="${sl.img}" alt=""></td>
        <td>${sl.heading || '—'}</td>
        <td>${sl.text || '—'}</td>
        <td>${sl.link ? `<span class="tag">${sl.link}</span>` : '—'}</td>
        <td class="row-actions">
          <button class="btn-outline mini" data-editslide="${i}">Edit</button>
          <button class="btn-danger mini" data-delslide="${i}">Delete</button>
        </td>
      </tr>`).join('') || `<tr><td colspan="5" class="empty">No slides. Add one below.</td></tr>`;
    $$('[data-editslide]').forEach(b => b.onclick = () => this.editSlide(+b.dataset.editslide));
    $$('[data-delslide]').forEach(b => b.onclick = () => {
      if (confirm('Delete this slide?')) { Store.deleteSlide(+b.dataset.delslide); this.renderSlideRows(); toast('Slide deleted'); }
    });
  },

  previewSlideImg(src) {
    $('#sPreviewWrap').innerHTML = src
      ? `<img src="${src}" style="width:80px;height:40px;object-fit:cover;border:1px solid var(--line);border-radius:4px">`
      : '';
  },

  editSlide(i) {
    const sl = Store.slides[i];
    if (!sl) return;
    this.editingSlide = i;
    $('#slideFormTitle').textContent = 'Edit Slide';
    $('#sHeading').value = sl.heading || '';
    $('#sText').value = sl.text || '';
    $('#sLink').value = sl.link || '';
    $('#sImgUrl').value = sl.img || '';
    $('#cancelSlide').style.display = 'inline-block';
    this.previewSlideImg(sl.img);
  },

  saveSlide() {
    const heading = $('#sHeading').value.trim();
    const data = {
      heading,
      text: $('#sText').value.trim(),
      link: $('#sLink').value,
      img: $('#sImgUrl').value.trim() || ph(heading.slice(0, 12) || 'Slide', Store.settings.themeColor),
    };
    if (this.editingSlide !== null) { Store.updateSlide(this.editingSlide, data); toast('Slide updated'); }
    else { Store.addSlide(data); toast('Slide added'); }
    this.resetSlideForm();
    this.renderSlideRows();
  },

  resetSlideForm() {
    this.editingSlide = null;
    $('#slideFormTitle').textContent = 'Add New Slide';
    ['sHeading', 'sText', 'sImgUrl'].forEach(id => { const el = $('#' + id); if (el) el.value = ''; });
    const f = $('#sImgFile'); if (f) f.value = '';
    if ($('#sLink')) $('#sLink').value = '';
    $('#cancelSlide').style.display = 'none';
    $('#sPreviewWrap').innerHTML = '';
  },

  previewImg(src) {
    $('#imgPreviewWrap').innerHTML = src
      ? `<img src="${src}" style="width:46px;height:46px;object-fit:contain;border:1px solid var(--line);border-radius:4px">`
      : '';
  },

  /* ---- settings ---- */
  saveSettings() {
    Store.updateSettings({
      storeName: $('#setName').value || 'Aura Shopping',
      themeColor: $('#setColor').value,
      tagline: $('#setTag').value,
      bannerText: $('#setBanner').value,
      currency: $('#setCur').value || '₹',
      footer: $('#setFooter').value,
    });
    applyBranding();
    toast('Settings saved');
  },

  /* ---- categories ---- */
  renderCats() {
    $('#catList').innerHTML = Store.categories.map(c =>
      `<span class="tag">${c} <button data-delcat="${c}" style="color:#e53935;font-weight:700">×</button></span>`
    ).join('') || '<span class="card-brand">No categories yet</span>';
    $$('[data-delcat]').forEach(b => b.onclick = () => {
      Store.deleteCategory(b.dataset.delcat);
      this.renderCats(); this.renderCatSelect();
    });
  },
  renderCatSelect() {
    $('#pCat').innerHTML = Store.categories.map(c => `<option>${c}</option>`).join('');
  },
  addCat() {
    const name = $('#newCat').value.trim();
    if (!name) return;
    Store.addCategory(name);
    $('#newCat').value = '';
    this.renderCats(); this.renderCatSelect();
    toast('Category added');
  },

  /* ---- products ---- */
  renderRows() {
    $('#prodRows').innerHTML = Store.products.map(p => `
      <tr>
        <td><img src="${p.img}" alt=""></td>
        <td>${p.title}</td>
        <td><span class="tag">${p.category}</span></td>
        <td>${money(p.price)}</td>
        <td>${p.mrp ? money(p.mrp) : '—'}</td>
        <td class="row-actions">
          <button class="btn-outline mini" data-edit="${p.id}">Edit</button>
          <button class="btn-danger mini" data-del="${p.id}">Delete</button>
        </td>
      </tr>`).join('') || `<tr><td colspan="6" class="empty">No products. Add one above.</td></tr>`;
    $$('[data-edit]').forEach(b => b.onclick = () => this.editProduct(b.dataset.edit));
    $$('[data-del]').forEach(b => b.onclick = () => {
      if (confirm('Delete this product?')) { Store.deleteProduct(b.dataset.del); this.render(); toast('Product deleted'); }
    });
  },

  editProduct(id) {
    const p = Store.getProduct(id);
    if (!p) return;
    this.editingId = id;
    $('#formTitle').textContent = 'Edit Product';
    $('#pTitle').value = p.title;
    $('#pBrand').value = p.brand || '';
    $('#pCat').value = p.category;
    $('#pRating').value = p.rating || '';
    $('#pPrice').value = p.price;
    $('#pMrp').value = p.mrp || '';
    $('#pImgUrl').value = p.img || '';
    $('#pDesc').value = p.desc || '';
    $('#cancelEdit').style.display = 'inline-block';
    this.previewImg(p.img);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  saveProduct() {
    const title = $('#pTitle').value.trim();
    const price = parseFloat($('#pPrice').value);
    if (!title) { toast('Title is required'); return; }
    if (isNaN(price)) { toast('Valid price is required'); return; }

    const data = {
      title,
      brand: $('#pBrand').value.trim(),
      category: $('#pCat').value || (Store.categories[0] || 'General'),
      rating: parseFloat($('#pRating').value) || 0,
      price,
      mrp: parseFloat($('#pMrp').value) || 0,
      img: $('#pImgUrl').value.trim() || ph(title.slice(0, 10), '#2874f0'),
      desc: $('#pDesc').value.trim(),
    };

    if (this.editingId) { Store.updateProduct(this.editingId, data); toast('Product updated'); }
    else { Store.addProduct(data); toast('Product added'); }

    this.resetForm();
    this.renderRows();
  },

  resetForm() {
    this.editingId = null;
    $('#formTitle').textContent = 'Add New Product';
    ['pTitle', 'pBrand', 'pRating', 'pPrice', 'pMrp', 'pImgUrl', 'pDesc'].forEach(id => { const el = $('#' + id); if (el) el.value = ''; });
    const file = $('#pImgFile'); if (file) file.value = '';
    $('#cancelEdit').style.display = 'none';
    $('#imgPreviewWrap').innerHTML = '';
  },

  /* ---- export / import / reset ---- */
  exportData() {
    const blob = new Blob([Store.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopkart-catalog.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Catalog exported');
  },

  importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        Store.importData(reader.result);
        applyBranding();
        refreshCartBadge();
        this.render();
        toast('Catalog imported');
      } catch (err) { alert('Import failed: ' + err.message); }
    };
    reader.readAsText(file);
  },

  resetAll() {
    if (!confirm('Reset everything to the default demo catalog? This erases your changes.')) return;
    Store.resetAll();
    applyBranding();
    refreshCartBadge();
    this.render();
    toast('Reset to defaults');
  },
};
