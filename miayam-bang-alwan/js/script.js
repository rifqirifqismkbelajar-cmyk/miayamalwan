// Miayam & Bakso Bang Alwan - Main Script

// Default products data
const defaultProducts = [
  {
    id: 1,
    name: "Mie Ayam Original",
    desc: "Mie ayam klasik dengan topping ayam suwir gurih, sawi, dan kuah kaldu spesial Bang Alwan.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
    category: "mie",
    badge: "Terlaris"
  },
  {
    id: 2,
    name: "Mie Ayam Bakso",
    desc: "Mie ayam + 2 bakso kenyal + pangsit goreng. Kombinasi sempurna favorit pelanggan.",
    price: 20000,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop",
    category: "mie",
    badge: "Best Seller"
  },
  {
    id: 3,
    name: "Mie Ayam Yamin",
    desc: "Mie yamin manis gurih dengan ayam dan bumbu rahasia. Cocok buat yang suka rasa manis.",
    price: 16000,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop",
    category: "mie",
    badge: null
  },
  {
    id: 4,
    name: "Bakso Urat Jumbo",
    desc: "Bakso urat besar + 3 bakso kecil + mie + sayur. Porsi kenyang banget!",
    price: 25000,
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=400&fit=crop",
    category: "bakso",
    badge: "Paling Laris"
  },
  {
    id: 5,
    name: "Bakso Campur",
    desc: "Campuran bakso urat, bakso biasa, dan bakso telor. Lengkap dengan kuah kaldu sapi.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1599921841143-819065a55c6f?w=600&h=400&fit=crop",
    category: "bakso",
    badge: null
  },
  {
    id: 6,
    name: "Mie Ayam Pangsit Basah",
    desc: "Mie ayam + pangsit basah lembut + pangsit goreng renyah. Tekstur yang menggoda.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    category: "mie",
    badge: null
  },
  {
    id: 7,
    name: "Paket Keluarga",
    desc: "3 porsi Mie Ayam Bakso + 6 bakso kecil + kerupuk + sambal. Hemat & kenyang!",
    price: 65000,
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=400&fit=crop",
    category: "paket",
    badge: "Hemat"
  },
  {
    id: 8,
    name: "Es Teh Manis",
    desc: "Es teh manis segar pelengkap sempurna untuk mie ayam dan bakso panas.",
    price: 5000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
    category: "minuman",
    badge: null
  }
];

// Initialize data
function initData() {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

function getProducts() {
  return JSON.parse(localStorage.getItem('products') || '[]');
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function formatPrice(price) {
  return 'Rp ' + price.toLocaleString('id-ID');
}

function showToast(msg, isError = false) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Navbar mobile
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
}

// Render products
function renderProducts(containerId, limit = null, category = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let products = getProducts();
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  if (limit) products = products.slice(0, limit);

  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#666;">Belum ada produk.</p>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x400/BBDEFB/1E88E5?text=${encodeURIComponent(p.name)}'">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      </div>
      <div class="content">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="price-row">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">+ Keranjang</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  }
  saveCart(cart);
  showToast(`${product.name} ditambahkan ke keranjang!`);
}

// Cart modal
function openCart() {
  const cart = getCart();
  const modal = document.getElementById('cartModal');
  const body = document.getElementById('cartBody');
  if (!modal || !body) return;

  if (cart.length === 0) {
    body.innerHTML = '<p style="text-align:center;padding:20px;color:#666;">Keranjang masih kosong.</p>';
  } else {
    let total = 0;
    body.innerHTML = `
      <div style="max-height:300px;overflow-y:auto;">
        ${cart.map((item, i) => {
          total += item.price * item.qty;
          return `
            <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #eee;">
              <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;" onerror="this.src='https://via.placeholder.com/60'">
              <div style="flex:1;">
                <strong>${item.name}</strong><br>
                <small>${formatPrice(item.price)} x ${item.qty}</small>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="btn btn-sm btn-outline" onclick="updateQty(${i}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn btn-sm btn-outline" onclick="updateQty(${i}, 1)">+</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="margin-top:20px;padding-top:16px;border-top:2px solid #eee;display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:1.2rem;">Total: ${formatPrice(total)}</strong>
        <button class="btn btn-primary" onclick="checkout()">Pesan Sekarang</button>
      </div>
    `;
  }
  modal.classList.add('active');
}

function updateQty(index, delta) {
  let cart = getCart();
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart(cart);
  openCart();
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  // Open order form prefilled
  document.getElementById('cartModal').classList.remove('active');
  const orderSection = document.getElementById('order');
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    // If not on contact page, redirect or show simple order
    showOrderForm(cart);
  }
}

function showOrderForm(cart) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsText = cart.map(i => `${i.name} x${i.qty}`).join(', ');

  const modal = document.getElementById('orderModal') || createOrderModal();
  document.getElementById('orderItemsPreview').textContent = itemsText;
  document.getElementById('orderTotalPreview').textContent = formatPrice(total);
  modal.classList.add('active');
}

function createOrderModal() {
  const div = document.createElement('div');
  div.id = 'orderModal';
  div.className = 'modal-overlay';
  div.innerHTML = `
    <div class="modal">
      <button class="close" onclick="this.closest('.modal-overlay').classList.remove('active')">&times;</button>
      <h3>Konfirmasi Pesanan</h3>
      <p style="margin:12px 0;color:#666;">Item: <span id="orderItemsPreview"></span></p>
      <p style="margin-bottom:20px;"><strong>Total: <span id="orderTotalPreview"></span></strong></p>
      <form id="quickOrderForm" onsubmit="submitOrder(event)">
        <div class="form-group">
          <label>Nama Lengkap *</label>
          <input type="text" name="name" required placeholder="Nama Anda">
        </div>
        <div class="form-group">
          <label>No. WhatsApp *</label>
          <input type="tel" name="phone" required placeholder="08xxxxxxxxxx">
        </div>
        <div class="form-group">
          <label>Alamat Pengiriman *</label>
          <textarea name="address" required placeholder="Alamat lengkap"></textarea>
        </div>
        <div class="form-group">
          <label>Catatan</label>
          <input type="text" name="note" placeholder="Level pedas, dll (opsional)">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">Kirim Pesanan</button>
      </form>
    </div>
  `;
  document.body.appendChild(div);
  return div;
}

function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Keranjang kosong!', true);
    return;
  }

  const order = {
    id: Date.now(),
    name: form.name.value,
    phone: form.phone.value,
    address: form.address.value,
    note: form.note.value || '',
    items: cart,
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    status: 'Baru',
    date: new Date().toLocaleString('id-ID')
  };

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('cart', JSON.stringify([]));
  updateCartBadge();

  form.reset();
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  showToast('Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.');
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Pesan berhasil dikirim! Terima kasih.');
      form.reset();
    });
  }
}

// Filter menu
function filterMenu(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts('menuGrid', null, cat);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initData();
  initNavbar();
  updateCartBadge();
  initContactForm();

  // Render featured on home
  if (document.getElementById('featuredProducts')) {
    renderProducts('featuredProducts', 4);
  }
  // Full menu
  if (document.getElementById('menuGrid')) {
    renderProducts('menuGrid');
  }
});
