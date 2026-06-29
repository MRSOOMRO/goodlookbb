const products = [
  { id: 1, name: 'Brow Gel', price: 9.99, desc: 'Everyday hold for clean brows.' },
  { id: 2, name: 'Lash Serum', price: 14.99, desc: 'Home care for fuller looking lashes.' },
  { id: 3, name: 'Brow Pencil', price: 7.99, desc: 'Soft definition with a natural finish.' },
  { id: 4, name: 'Brow Brush Kit', price: 6.99, desc: 'Brush and shape your brows daily.' },
  { id: 5, name: 'Tint Aftercare Oil', price: 11.99, desc: 'Soft aftercare for brow and lash treatments.' },
  { id: 6, name: 'Beauty Gift Card', price: 25.00, desc: 'Perfect gift for salon services.' }
];

let cart = JSON.parse(localStorage.getItem('glb_cart') || '[]');
let discountRate = 0;

function money(n){ return '£' + Number(n).toFixed(2); }
function saveCart(){ localStorage.setItem('glb_cart', JSON.stringify(cart)); }

function renderProducts(){
  const wrap = document.getElementById('shopProducts');
  if(!wrap) return;
  wrap.innerHTML = products.map(p => `
    <article class="product reveal">
      <div class="product-image"><span>${p.name}</span></div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <strong>${money(p.price)}</strong>
      <button class="btn primary small" onclick="addToCart(${p.id})">Add to Cart</button>
    </article>`).join('');
}

function addToCart(id){
  const found = cart.find(i => i.id === id);
  if(found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart(){
  const el = document.getElementById('cartItems');
  if(!el) return;
  if(!cart.length){
    el.innerHTML = '<p class="empty">Your cart is empty.</p>';
  } else {
    el.innerHTML = cart.map(i => {
      const p = products.find(x => x.id === i.id);
      return `<div class="cart-line"><div><strong>${p.name}</strong><span>${money(p.price)} x ${i.qty}</span></div><div><button onclick="changeQty(${i.id},-1)">−</button><button onclick="changeQty(${i.id},1)">+</button></div></div>`;
    }).join('');
  }
  const subtotal = cart.reduce((sum,i)=>{
    const p = products.find(x => x.id === i.id);
    return sum + p.price * i.qty;
  },0);
  const discount = subtotal * discountRate;
  document.getElementById('subtotal').textContent = money(subtotal);
  document.getElementById('discount').textContent = money(discount);
  document.getElementById('total').textContent = money(subtotal - discount);
}

document.getElementById('applyCoupon')?.addEventListener('click', () => {
  const code = document.getElementById('couponCode').value.trim().toUpperCase();
  discountRate = code === 'GL10' ? 0.10 : 0;
  renderCart();
});

document.getElementById('checkoutForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if(!cart.length){ document.getElementById('checkoutMessage').textContent = 'Please add products before checkout.'; return; }
  const data = Object.fromEntries(new FormData(e.target).entries());
  const subtotal = cart.reduce((sum,i)=>sum + products.find(x=>x.id===i.id).price * i.qty,0);
  const total = subtotal - subtotal * discountRate;
  const order = {
    id: 'GLB' + Date.now().toString().slice(-6),
    customer: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    items: cart.map(i => ({...products.find(p=>p.id===i.id), qty:i.qty})),
    total,
    payment: 'Bank Transfer',
    status: 'Pending Payment',
    created: new Date().toLocaleString()
  };
  const orders = JSON.parse(localStorage.getItem('glb_orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('glb_orders', JSON.stringify(orders));
  cart = [];
  saveCart();
  e.target.reset();
  renderCart();
  document.getElementById('checkoutMessage').textContent = `Order ${order.id} placed. Please pay by bank transfer using this order number as reference.`;
});

renderProducts();
renderCart();
