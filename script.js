const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.getElementById('year')?.append(new Date().getFullYear());

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function productCard(product, buttonHtml){
  const hasOffer = product.offerPrice !== '' && product.offerPrice !== null && !Number.isNaN(Number(product.offerPrice));
  const priceHtml = hasOffer
    ? `<strong>${money(product.offerPrice)}</strong><span class="old-price">${money(product.price)}</span>`
    : `<strong>${money(product.price)}</strong>`;
  return `
    <article class="product reveal">
      <div class="product-image"><span>${product.name}</span></div>
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
      <div class="price-row">${priceHtml}</div>
      ${Number(product.stock) > 0 ? `<p class="stock-text">${product.stock} in stock</p>` : '<p class="stock-text out">Out of stock</p>'}
      ${buttonHtml || ''}
    </article>`;
}

function renderHomeProducts(){
  const wrap = document.getElementById('homeProducts');
  if(!wrap || typeof getProducts !== 'function') return;
  const items = getProducts().filter(p => p.active !== false).slice(0, 3);
  wrap.innerHTML = items.map(p => productCard(p, '<a class="btn secondary small" href="products.html">Shop Now</a>')).join('');
  wrap.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
renderHomeProducts();
