const GLB_DB_KEY = 'glb_database_v4';
const GLB_SESSION_KEY = 'glb_admin_session_v4';

const placeholderProduct = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
<rect width="900" height="700" fill="#f7eee9"/>
<circle cx="450" cy="270" r="130" fill="#fff" stroke="#e8c1cc" stroke-width="8"/>
<path d="M330 292c75-82 170-88 240-9" fill="none" stroke="#c7a449" stroke-width="14" stroke-linecap="round"/>
<path d="M365 310c60-34 135-38 205-18" fill="none" stroke="#2b2222" stroke-width="8" stroke-linecap="round"/>
<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="#332529">Good Look</text>
<text x="450" y="555" text-anchor="middle" font-family="Arial" font-size="25" letter-spacing="8" fill="#e5a6b9">PRODUCT IMAGE</text>
</svg>` )}`;

const placeholderService = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
<rect width="900" height="700" fill="#fbf6f3"/>
<circle cx="450" cy="285" r="145" fill="#fff" stroke="#d4af37" stroke-width="8"/>
<path d="M365 300c45-75 130-88 190-21" fill="none" stroke="#e7a1b7" stroke-width="12" stroke-linecap="round"/>
<path d="M330 345c90 58 195 50 270-20" fill="none" stroke="#c7a449" stroke-width="7" stroke-linecap="round"/>
<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#332529">Beauty Service</text>
<text x="450" y="565" text-anchor="middle" font-family="Arial" font-size="24" letter-spacing="8" fill="#e5a6b9">PLACEHOLDER</text>
</svg>` )}`;

const defaultDatabase = {
  products: [
    { id: 'p1', name: 'Brow Styling Gel', description: 'Clear hold gel for clean everyday brows.', price: 9.99, offerPrice: 7.99, stock: 18, image: placeholderProduct, visible: true },
    { id: 'p2', name: 'Lash Care Serum', description: 'Daily lash care serum for a soft healthy look.', price: 14.99, offerPrice: 12.99, stock: 12, image: placeholderProduct, visible: true },
    { id: 'p3', name: 'Soft Brow Pencil', description: 'Natural definition with a smooth finish.', price: 7.99, offerPrice: 6.49, stock: 24, image: placeholderProduct, visible: true },
    { id: 'p4', name: 'Brow Brush Kit', description: 'Brush, shape, and tidy brows at home.', price: 6.99, offerPrice: '', stock: 20, image: placeholderProduct, visible: true },
    { id: 'p5', name: 'Tint Aftercare Oil', description: 'Gentle aftercare for brows and lashes.', price: 11.99, offerPrice: 9.99, stock: 10, image: placeholderProduct, visible: true },
    { id: 'p6', name: 'Beauty Gift Card', description: 'A simple gift for beauty treatments.', price: 25, offerPrice: '', stock: 50, image: placeholderProduct, visible: true }
  ],
  services: [
    { id: 's1', name: 'Eyebrow Threading', description: 'Clean shaping with a defined finish.', price: 8, duration: '15 min', image: placeholderService, visible: true },
    { id: 's2', name: 'Brow Lamination', description: 'Fuller looking brows with a soft lifted style.', price: 28, duration: '45 min', image: placeholderService, visible: true },
    { id: 's3', name: 'Lash Lift', description: 'Natural lash lift for open looking eyes.', price: 35, duration: '60 min', image: placeholderService, visible: true }
  ],
  orders: [],
  appointments: [
    { id: 'a1', customer: 'Aisha Khan', phone: '07123000111', service: 'Eyebrow Threading', date: '2026-07-02', time: '10:30', status: 'Booked' },
    { id: 'a2', customer: 'Sarah Jones', phone: '07123000222', service: 'Brow Lamination', date: '2026-07-03', time: '14:00', status: 'Booked' }
  ],
  settings: {
    bankName: 'Good Look Browbar', sortCode: '00-00-00', accountNumber: '00000000', referenceText: 'Use your order number as payment reference.', couponCode: 'GL10', couponPercent: 10
  }
};

function uid(prefix = 'id') { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`; }
function money(value) { const n = Number(value || 0); return `£${n.toFixed(2)}`; }
function getDb() {
  const raw = localStorage.getItem(GLB_DB_KEY);
  if (!raw) { localStorage.setItem(GLB_DB_KEY, JSON.stringify(defaultDatabase)); return structuredClone(defaultDatabase); }
  try { return { ...structuredClone(defaultDatabase), ...JSON.parse(raw) }; }
  catch { localStorage.setItem(GLB_DB_KEY, JSON.stringify(defaultDatabase)); return structuredClone(defaultDatabase); }
}
function saveDb(db) { localStorage.setItem(GLB_DB_KEY, JSON.stringify(db)); }
function isAdminLoggedIn() { return localStorage.getItem(GLB_SESSION_KEY) === 'yes'; }
function setAdminLoggedIn(value) { value ? localStorage.setItem(GLB_SESSION_KEY, 'yes') : localStorage.removeItem(GLB_SESSION_KEY); }
function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
function productPrice(product) { return Number(product.offerPrice || product.price || 0); }
function cartItems() { return JSON.parse(localStorage.getItem('glb_cart_v4') || '[]'); }
function saveCart(items) { localStorage.setItem('glb_cart_v4', JSON.stringify(items)); }
function cartCount() { return cartItems().reduce((sum, item) => sum + Number(item.qty || 0), 0); }
