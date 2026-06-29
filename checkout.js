let cart = getCart();
let discountRate = 0;

function renderCheckoutCart(){
  const el = document.getElementById('cartItems');
  const products = getProducts();
  if(!cart.length){
    el.innerHTML = '<p class="empty">Your cart is empty. Please add products first.</p>';
  } else {
    el.innerHTML = cart.map(i => {
      const p = products.find(x => Number(x.id) === Number(i.id));
      if(!p) return '';
      return `<div class="cart-line"><div><strong>${p.name}</strong><span>${money(salePrice(p))} x ${i.qty}</span></div><strong>${money(salePrice(p) * i.qty)}</strong></div>`;
    }).join('');
  }
  const subtotal = cart.reduce((sum,i)=>{
    const p = products.find(x => Number(x.id) === Number(i.id));
    return p ? sum + salePrice(p) * i.qty : sum;
  },0);
  const discount = subtotal * discountRate;
  document.getElementById('subtotal').textContent = money(subtotal);
  document.getElementById('discount').textContent = money(discount);
  document.getElementById('total').textContent = money(subtotal - discount);
  return { products, subtotal, discount, total: subtotal - discount };
}

document.getElementById('applyCoupon')?.addEventListener('click', () => {
  const code = document.getElementById('couponCode').value.trim().toUpperCase();
  discountRate = code === 'GL10' ? 0.10 : 0;
  renderCheckoutCart();
});

document.getElementById('checkoutForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if(!cart.length){ document.getElementById('checkoutMessage').textContent = 'Please add products before checkout.'; return; }
  const summary = renderCheckoutCart();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const order = {
    id: 'GLB' + Date.now().toString().slice(-6),
    customer: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    items: cart.map(i => {
      const p = summary.products.find(x => Number(x.id) === Number(i.id));
      return { id: p.id, name: p.name, price: salePrice(p), qty: i.qty };
    }),
    subtotal: summary.subtotal,
    discount: summary.discount,
    total: summary.total,
    payment: 'Bank Transfer',
    status: 'Pending Payment',
    created: new Date().toLocaleString()
  };
  const products = summary.products;
  cart.forEach(i => {
    const p = products.find(x => Number(x.id) === Number(i.id));
    if(p) p.stock = Math.max(0, Number(p.stock) - Number(i.qty));
  });
  saveProducts(products);
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  cart = [];
  saveCart(cart);
  e.target.reset();
  renderCheckoutCart();
  document.getElementById('checkoutMessage').textContent = `Order ${order.id} placed. Please pay by bank transfer using this order number as reference.`;
});

renderCheckoutCart();
