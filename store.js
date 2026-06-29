const GLB = (() => {
  const DB_KEY = 'glb_database_v7';
  const CART_KEY = 'glb_cart_v7';
  const ADMIN_KEY = 'glb_admin_logged_in_v7';
  const placeholder = 'assets/placeholder.png';

  const seed = {
    products: [
      { id: uid(), name: 'Brow Styling Gel', description: 'Clear hold gel for clean everyday brows.', price: 9.99, offerPrice: 7.99, stock: 18, image: placeholder, visible: true, featured: true },
      { id: uid(), name: 'Lash Care Serum', description: 'Daily lash care serum for a soft healthy look.', price: 14.99, offerPrice: 12.99, stock: 12, image: placeholder, visible: true, featured: true },
      { id: uid(), name: 'Soft Brow Pencil', description: 'Natural definition with a smooth finish.', price: 7.99, offerPrice: 6.49, stock: 24, image: placeholder, visible: true, featured: true },
      { id: uid(), name: 'Brow Brush Kit', description: 'Brush, shape, and tidy brows at home.', price: 6.99, offerPrice: 0, stock: 20, image: placeholder, visible: true, featured: false },
      { id: uid(), name: 'Tint Aftercare Oil', description: 'Gentle aftercare for brows and lashes.', price: 11.99, offerPrice: 9.99, stock: 10, image: placeholder, visible: true, featured: false },
      { id: uid(), name: 'Beauty Gift Card', description: 'A simple gift for beauty treatments.', price: 25.00, offerPrice: 0, stock: 50, image: placeholder, visible: true, featured: false }
    ],
    services: [
      { id: uid(), name: 'Eyebrow Threading', price: 8, duration: '15 min', image: placeholder, visible: true },
      { id: uid(), name: 'Brow Tint', price: 10, duration: '20 min', image: placeholder, visible: true },
      { id: uid(), name: 'Brow Lamination', price: 28, duration: '45 min', image: placeholder, visible: true },
      { id: uid(), name: 'Lash Tint', price: 12, duration: '25 min', image: placeholder, visible: true },
      { id: uid(), name: 'Full Face Threading', price: 22, duration: '35 min', image: placeholder, visible: true }
    ],
    appointments: [
      { id: uid(), customer: 'Aisha Khan', phone: '07123 001111', service: 'Eyebrow Threading', date: '2026-07-02', time: '10:30', status: 'Booked', notes: '' },
      { id: uid(), customer: 'Sarah Jones', phone: '07123 002222', service: 'Brow Lamination', date: '2026-07-03', time: '14:00', status: 'Booked', notes: '' }
    ],
    orders: []
  };

  function uid(){ return 'glb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }
  function money(v){ return '£' + Number(v || 0).toFixed(2); }
  function priceOf(p){ return Number(p.offerPrice || 0) > 0 ? Number(p.offerPrice) : Number(p.price || 0); }
  function load(){
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) { localStorage.setItem(DB_KEY, JSON.stringify(seed)); return structuredClone(seed); }
    try { return JSON.parse(raw); } catch { localStorage.setItem(DB_KEY, JSON.stringify(seed)); return structuredClone(seed); }
  }
  function save(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }
  function reset(){ localStorage.setItem(DB_KEY, JSON.stringify(seed)); localStorage.removeItem(CART_KEY); }
  function cart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); updateCartBadge(); }
  function updateCartBadge(){
    const el = document.querySelector('[data-cart-count]');
    if (el) el.textContent = cart().reduce((a, b) => a + Number(b.qty || 0), 0);
  }
  function addToCart(id, qty = 1){
    const db = load();
    const product = db.products.find(p => p.id === id);
    if (!product || !product.visible) return false;
    const items = cart();
    const found = items.find(i => i.id === id);
    if (found) found.qty += qty; else items.push({ id, qty });
    saveCart(items);
    return true;
  }
  function removeFromCart(id){ saveCart(cart().filter(i => i.id !== id)); }
  function clearCart(){ saveCart([]); }
  function cartDetails(){
    const db = load();
    const rows = cart().map(item => {
      const product = db.products.find(p => p.id === item.id);
      if (!product) return null;
      const unit = priceOf(product);
      return { ...item, product, unit, line: unit * item.qty };
    }).filter(Boolean);
    const subtotal = rows.reduce((a, r) => a + r.line, 0);
    return { rows, subtotal };
  }
  function setAdminLoggedIn(v){ v ? sessionStorage.setItem(ADMIN_KEY, 'yes') : sessionStorage.removeItem(ADMIN_KEY); }
  function isAdminLoggedIn(){ return sessionStorage.getItem(ADMIN_KEY) === 'yes'; }
  return { load, save, reset, uid, money, priceOf, placeholder, addToCart, removeFromCart, clearCart, cart, cartDetails, updateCartBadge, setAdminLoggedIn, isAdminLoggedIn };
})();

document.addEventListener('DOMContentLoaded', GLB.updateCartBadge);
