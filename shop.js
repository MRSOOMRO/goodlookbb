let cart = getCart();

function renderProducts(){
  const wrap = document.getElementById('shopProducts');
  if(!wrap) return;
  const products = getProducts().filter(p => p.active !== false);
  wrap.innerHTML = products.map(p => {
    const disabled = Number(p.stock) <= 0 ? 'disabled' : '';
    const btn = `<button class="btn primary small" onclick="addToCart(${p.id})" ${disabled}>${disabled ? 'Out of Stock' : 'Add to Cart'}</button>`;
    return productCard(p, btn);
  }).join('');
}

function addToCart(id){
  const products = getProducts();
  const product = products.find(p => Number(p.id) === Number(id));
  if(!product || Number(product.stock) <= 0) return;
  const found = cart.find(i => Number(i.id) === Number(id));
  if(found){
    if(found.qty < Number(product.stock)) found.qty += 1;
  } else {
    cart.push({ id: Number(id), qty: 1 });
  }
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta){
  const products = getProducts();
  const product = products.find(p => Number(p.id) === Number(id));
  const item = cart.find(i => Number(i.id) === Number(id));
  if(!item || !product) return;
  item.qty += delta;
  if(item.qty > Number(product.stock)) item.qty = Number(product.stock);
  if(item.qty <= 0) cart = cart.filter(i => Number(i.id) !== Number(id));
  saveCart(cart);
  renderCart();
}

function renderCart(){
  const el = document.getElementById('cartItems');
  if(!el) return;
  const products = getProducts();
  if(!cart.length){
    el.innerHTML = '<p class="empty">Your cart is empty.</p>';
  } else {
    el.innerHTML = cart.map(i => {
      const p = products.find(x => Number(x.id) === Number(i.id));
      if(!p) return '';
      return `<div class="cart-line"><div><strong>${p.name}</strong><span>${money(salePrice(p))} x ${i.qty}</span></div><div><button onclick="changeQty(${i.id},-1)">−</button><button onclick="changeQty(${i.id},1)">+</button></div></div>`;
    }).join('');
  }
  const subtotal = cart.reduce((sum,i)=>{
    const p = products.find(x => Number(x.id) === Number(i.id));
    return p ? sum + salePrice(p) * i.qty : sum;
  },0);
  document.getElementById('subtotal').textContent = money(subtotal);
}

renderProducts();
renderCart();
