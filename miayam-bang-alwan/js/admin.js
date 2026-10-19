// Admin Panel Script - Miayam & Bakso Bang Alwan

const ADMIN_PASS = 'admin123';

function checkAuth() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

function login(e) {
  e.preventDefault();
  const pass = document.getElementById('password').value;
  if (pass === ADMIN_PASS) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showDashboard();
  } else {
    document.getElementById('loginError').textContent = 'Password salah! Coba lagi.';
    document.getElementById('loginError').style.display = 'block';
  }
}

function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  location.reload();
}

function showDashboard() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('adminSection').style.display = 'grid';
  loadDashboard();
  showPage('dashboard');
}

function showPage(page) {
  document.querySelectorAll('.admin-page').forEach(p => p.style.display = 'none');
  document.getElementById('page-' + page).style.display = 'block';
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.admin-nav a[data-page="${page}"]`);
  if (link) link.classList.add('active');

  if (page === 'products') loadProductsTable();
  if (page === 'orders') loadOrdersTable();
  if (page === 'dashboard') loadDashboard();
}

function loadDashboard() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const newOrders = orders.filter(o => o.status === 'Baru').length;

  document.getElementById('statProducts').textContent = products.length;
  document.getElementById('statOrders').textContent = orders.length;
  document.getElementById('statNew').textContent = newOrders;
  document.getElementById('statRevenue').textContent = 'Rp ' + totalRevenue.toLocaleString('id-ID');

  // Recent orders
  const recent = orders.slice(0, 5);
  const tbody = document.getElementById('recentOrders');
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#666;">Belum ada pesanan</td></tr>';
  } else {
    tbody.innerHTML = recent.map(o => `
      <tr>
        <td>#${o.id.toString().slice(-6)}</td>
        <td>${o.name}</td>
        <td>Rp ${o.total.toLocaleString('id-ID')}</td>
        <td><span class="badge-status ${o.status.toLowerCase()}">${o.status}</span></td>
        <td>${o.date}</td>
      </tr>
    `).join('');
  }
}

function loadProductsTable() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const tbody = document.getElementById('productsTable');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" onerror="this.src='https://via.placeholder.com/50'"></td>
      <td>${p.name}</td>
      <td>Rp ${p.price.toLocaleString('id-ID')}</td>
      <td>${p.category}</td>
      <td>${p.badge || '-'}</td>
      <td class="action-btns">
        <button class="btn btn-sm btn-outline" onclick="editProduct(${p.id})">Edit</button>
        <button class="btn btn-sm" style="background:#E53935;color:white;" onclick="deleteProduct(${p.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function loadOrdersTable() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const tbody = document.getElementById('ordersTable');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#666;">Belum ada pesanan</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>#${o.id.toString().slice(-6)}</td>
      <td>
        <strong>${o.name}</strong><br>
        <small>${o.phone}</small>
      </td>
      <td style="max-width:200px;font-size:0.85rem;">${o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</td>
      <td>Rp ${o.total.toLocaleString('id-ID')}</td>
      <td>
        <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding:6px;border-radius:6px;border:1px solid #ddd;">
          <option value="Baru" ${o.status==='Baru'?'selected':''}>Baru</option>
          <option value="Diproses" ${o.status==='Diproses'?'selected':''}>Diproses</option>
          <option value="Dikirim" ${o.status==='Dikirim'?'selected':''}>Dikirim</option>
          <option value="Selesai" ${o.status==='Selesai'?'selected':''}>Selesai</option>
          <option value="Batal" ${o.status==='Batal'?'selected':''}>Batal</option>
        </select>
      </td>
      <td>${o.date}</td>
      <td><button class="btn btn-sm btn-outline" onclick="viewOrderDetail(${o.id})">Detail</button></td>
    </tr>
  `).join('');
}

function updateOrderStatus(id, status) {
  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const idx = orders.findIndex(o => o.id === id);
  if (idx > -1) {
    orders[idx].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
    showToast('Status diperbarui');
  }
}

function viewOrderDetail(id) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const o = orders.find(x => x.id === id);
  if (!o) return;
  alert(`Pesanan #${o.id}\n\nNama: ${o.name}\nTelp: ${o.phone}\nAlamat: ${o.address}\nCatatan: ${o.note || '-'}\n\nItem:\n${o.items.map(i => `- ${i.name} x${i.qty} (Rp ${(i.price*i.qty).toLocaleString('id-ID')})`).join('\n')}\n\nTotal: Rp ${o.total.toLocaleString('id-ID')}\nStatus: ${o.status}\nTanggal: ${o.date}`);
}

function openProductModal(id = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  form.reset();
  document.getElementById('productId').value = '';
  document.getElementById('modalTitle').textContent = 'Tambah Produk';

  if (id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const p = products.find(x => x.id === id);
    if (p) {
      document.getElementById('productId').value = p.id;
      document.getElementById('prodName').value = p.name;
      document.getElementById('prodDesc').value = p.desc;
      document.getElementById('prodPrice').value = p.price;
      document.getElementById('prodImage').value = p.image;
      document.getElementById('prodCategory').value = p.category;
      document.getElementById('prodBadge').value = p.badge || '';
      document.getElementById('modalTitle').textContent = 'Edit Produk';
    }
  }
  modal.classList.add('active');
}

function editProduct(id) {
  openProductModal(id);
}

function saveProduct(e) {
  e.preventDefault();
  let products = JSON.parse(localStorage.getItem('products') || '[]');
  const id = document.getElementById('productId').value;
  const data = {
    name: document.getElementById('prodName').value,
    desc: document.getElementById('prodDesc').value,
    price: parseInt(document.getElementById('prodPrice').value),
    image: document.getElementById('prodImage').value || 'https://via.placeholder.com/600x400/BBDEFB/1E88E5?text=Produk',
    category: document.getElementById('prodCategory').value,
    badge: document.getElementById('prodBadge').value || null
  };

  if (id) {
    const idx = products.findIndex(p => p.id === parseInt(id));
    if (idx > -1) products[idx] = { ...products[idx], ...data };
  } else {
    data.id = Date.now();
    products.push(data);
  }

  localStorage.setItem('products', JSON.stringify(products));
  document.getElementById('productModal').classList.remove('active');
  loadProductsTable();
  showToast(id ? 'Produk diperbarui' : 'Produk ditambahkan');
}

function deleteProduct(id) {
  if (!confirm('Yakin hapus produk ini?')) return;
  let products = JSON.parse(localStorage.getItem('products') || '[]');
  products = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(products));
  loadProductsTable();
  showToast('Produk dihapus');
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    showDashboard();
  }
});
