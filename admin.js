const sampleAppointments = [
  { customer:'Aisha Khan', phone:'07123 000111', service:'Eyebrow Threading', date:'2026-07-02', time:'10:30', status:'Booked' },
  { customer:'Sarah Jones', phone:'07123 000222', service:'Brow Lamination', date:'2026-07-03', time:'14:00', status:'Booked' }
];

function showDashboard(){
  document.getElementById('loginPanel')?.classList.add('hidden');
  document.getElementById('adminDashboard')?.classList.remove('hidden');
  renderProductsAdmin();
  renderAppointments();
  renderOrders();
}
function showLogin(){
  document.getElementById('loginPanel')?.classList.remove('hidden');
  document.getElementById('adminDashboard')?.classList.add('hidden');
}

if(isLoggedIn()) showDashboard(); else showLogin();

document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  if(data.username === 'admin' && data.password === 'GLB2026'){
    localStorage.setItem(GLB_ADMIN_KEY, 'yes');
    showDashboard();
    e.target.reset();
  } else {
    document.getElementById('loginMessage').textContent = 'Incorrect username or password.';
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem(GLB_ADMIN_KEY);
  showLogin();
});

function renderProductsAdmin(){
  const body = document.getElementById('productRows');
  if(!body) return;
  const products = getProducts();
  body.innerHTML = products.map((p,i)=>`<tr><td><strong>${p.name}</strong><br><small>${p.desc}</small></td><td>${money(p.price)}</td><td>${p.offerPrice !== '' ? money(p.offerPrice) : '-'}</td><td>${p.stock}</td><td><span class="pill">${p.active !== false ? 'Visible' : 'Hidden'}</span></td><td><button class="table-btn" onclick="editProduct(${i})">Edit</button> <button class="table-btn" onclick="deleteProduct(${i})">Delete</button></td></tr>`).join('');
}

function editProduct(i){
  const products = getProducts();
  const p = products[i];
  const form = document.getElementById('productForm');
  form.elements.id.value = p.id;
  form.elements.name.value = p.name;
  form.elements.desc.value = p.desc;
  form.elements.price.value = p.price;
  form.elements.offerPrice.value = p.offerPrice || '';
  form.elements.stock.value = p.stock;
  form.elements.active.checked = p.active !== false;
  document.getElementById('productFormTitle').textContent = 'Edit product';
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function deleteProduct(i){
  const products = getProducts();
  products.splice(i,1);
  saveProducts(products);
  renderProductsAdmin();
}
function resetProductForm(){
  const form = document.getElementById('productForm');
  form.reset();
  form.elements.id.value = '';
  form.elements.active.checked = true;
  document.getElementById('productFormTitle').textContent = 'Add product';
}

document.getElementById('resetProductForm')?.addEventListener('click', resetProductForm);

document.getElementById('productForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const products = getProducts();
  const item = {
    id: data.id ? Number(data.id) : Date.now(),
    name: data.name.trim(),
    desc: data.desc.trim(),
    price: Number(data.price),
    offerPrice: data.offerPrice === '' ? '' : Number(data.offerPrice),
    stock: Number(data.stock),
    active: data.active === 'on'
  };
  const index = products.findIndex(p => Number(p.id) === Number(item.id));
  if(index >= 0) products[index] = item;
  else products.unshift(item);
  saveProducts(products);
  resetProductForm();
  renderProductsAdmin();
});

function loadAppointments(){
  let items = readJson('glb_appointments', null);
  if(!items){ items = sampleAppointments; writeJson('glb_appointments', items); }
  return items;
}
function saveAppointments(items){ writeJson('glb_appointments', items); }

function renderAppointments(){
  const body = document.getElementById('appointmentRows');
  if(!body) return;
  const items = loadAppointments();
  body.innerHTML = items.map((a,i)=>`<tr><td>${a.customer}<br><small>${a.phone}</small></td><td>${a.service}</td><td>${a.date}<br><small>${a.time}</small></td><td><span class="pill">${a.status}</span></td><td><button class="table-btn" onclick="deleteAppointment(${i})">Delete</button></td></tr>`).join('');
}
function deleteAppointment(i){ const items=loadAppointments(); items.splice(i,1); saveAppointments(items); renderAppointments(); }

document.getElementById('appointmentForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const item = Object.fromEntries(new FormData(e.target).entries());
  const items = loadAppointments();
  items.unshift(item);
  saveAppointments(items);
  e.target.reset();
  renderAppointments();
});

function renderOrders(){
  const body = document.getElementById('orderRows');
  if(!body) return;
  const orders = getOrders();
  if(!orders.length){ body.innerHTML = '<tr><td colspan="7">No product orders yet. Place a test order from the products page.</td></tr>'; return; }
  body.innerHTML = orders.map((o,i)=>`<tr><td>${o.id}<br><small>${o.created}</small></td><td>${o.customer}<br><small>${o.phone}</small></td><td>${o.items.map(x=>`${x.name} x ${x.qty}`).join('<br>')}</td><td>${money(o.total)}</td><td>${o.payment}</td><td><select onchange="updateOrderStatus(${i}, this.value)"><option ${o.status==='Pending Payment'?'selected':''}>Pending Payment</option><option ${o.status==='Paid'?'selected':''}>Paid</option><option ${o.status==='Dispatched'?'selected':''}>Dispatched</option><option ${o.status==='Cancelled'?'selected':''}>Cancelled</option></select></td><td><button class="table-btn" onclick="deleteOrder(${i})">Delete</button></td></tr>`).join('');
}
function updateOrderStatus(i,status){ const orders=getOrders(); orders[i].status=status; saveOrders(orders); renderOrders(); }
function deleteOrder(i){ const orders=getOrders(); orders.splice(i,1); saveOrders(orders); renderOrders(); }
