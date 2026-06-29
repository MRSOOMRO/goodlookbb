const GLB_ADMIN_KEY = 'glb_admin_logged_in';
const GLB_PRODUCT_KEY = 'glb_products';
const GLB_CART_KEY = 'glb_cart';
const GLB_ORDER_KEY = 'glb_orders';

const defaultProducts = [
  { id: 1, name: 'Brow Styling Gel', price: 9.99, offerPrice: 7.99, stock: 18, desc: 'Clear hold gel for clean everyday brows.', active: true },
  { id: 2, name: 'Lash Care Serum', price: 14.99, offerPrice: 12.99, stock: 12, desc: 'Daily lash care serum for a soft healthy look.', active: true },
  { id: 3, name: 'Soft Brow Pencil', price: 7.99, offerPrice: 6.49, stock: 24, desc: 'Natural definition with a smooth finish.', active: true },
  { id: 4, name: 'Brow Brush Kit', price: 6.99, offerPrice: '', stock: 20, desc: 'Brush, shape, and tidy brows at home.', active: true },
  { id: 5, name: 'Tint Aftercare Oil', price: 11.99, offerPrice: 9.99, stock: 10, desc: 'Gentle aftercare for brows and lashes.', active: true },
  { id: 6, name: 'Beauty Gift Card', price: 25.00, offerPrice: '', stock: 50, desc: 'A simple gift for beauty treatments.', active: true }
];

function money(n){ return '£' + Number(n || 0).toFixed(2); }
function readJson(key, fallback){
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function getProducts(){
  let products = readJson(GLB_PRODUCT_KEY, null);
  if(!products || !Array.isArray(products) || !products.length){
    products = defaultProducts;
    writeJson(GLB_PRODUCT_KEY, products);
  }
  return products;
}
function saveProducts(products){ writeJson(GLB_PRODUCT_KEY, products); }
function getCart(){ return readJson(GLB_CART_KEY, []); }
function saveCart(cart){ writeJson(GLB_CART_KEY, cart); }
function getOrders(){ return readJson(GLB_ORDER_KEY, []); }
function saveOrders(orders){ writeJson(GLB_ORDER_KEY, orders); }
function salePrice(product){ return product.offerPrice !== '' && product.offerPrice !== null && !Number.isNaN(Number(product.offerPrice)) ? Number(product.offerPrice) : Number(product.price); }
function isLoggedIn(){ return localStorage.getItem(GLB_ADMIN_KEY) === 'yes'; }
