const db = getDb();
const cartCountNode = document.getElementById('cartCount');
if (cartCountNode) cartCountNode.textContent = cartCount();
const homeProducts = document.getElementById('homeProducts');
if (homeProducts) homeProducts.innerHTML = db.products.filter(p=>p.visible).slice(0,3).map(productCard).join('');
const serviceCards = document.getElementById('serviceCards');
if (serviceCards) serviceCards.innerHTML = db.services.filter(s=>s.visible).map(s=>`<article class="card"><img class="service-img" src="${s.image || placeholderService}" alt="${s.name}"><div class="card-body"><h3>${s.name}</h3><p class="muted">${s.description}</p><p class="price"><span>${money(s.price)}</span><span class="muted">${s.duration}</span></p></div></article>`).join('');
function productCard(p){return `<article class="card"><img class="product-img" src="${p.image || placeholderProduct}" alt="${p.name}"><div class="card-body"><h3>${p.name}</h3><p class="muted">${p.description}</p><p class="price">${p.offerPrice?`<span class="old">${money(p.price)}</span><span class="offer">${money(p.offerPrice)}</span>`:`<span>${money(p.price)}</span>`}</p><button class="btn" onclick="addToCart('${p.id}')">Add to cart</button></div></article>`}
function addToCart(id){const items=cartItems();const found=items.find(i=>i.id===id);found?found.qty++:items.push({id,qty:1});saveCart(items);const cartCountNode = document.getElementById('cartCount'); if (cartCountNode) cartCountNode.textContent=cartCount();alert('Added to cart');}
const bookingService = document.getElementById('bookingService');
if (bookingService) bookingService.innerHTML = db.services.map(s=>`<option>${s.name}</option>`).join('');
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) bookingForm.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(bookingForm);const db=getDb();db.appointments.unshift({id:uid('a'),customer:f.get('customer'),phone:f.get('phone'),service:f.get('service'),date:f.get('date'),time:f.get('time'),status:'Requested'});saveDb(db);bookingForm.reset();document.getElementById('bookingMsg').textContent='Appointment request saved. We will contact you to confirm.'});
