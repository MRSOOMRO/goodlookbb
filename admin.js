const sampleAppointments = [
  { customer:'Aisha Khan', phone:'07123 000111', service:'Eyebrow Threading', date:'2026-07-02', time:'10:30', status:'Booked' },
  { customer:'Sarah Jones', phone:'07123 000222', service:'Brow Lamination', date:'2026-07-03', time:'14:00', status:'Booked' }
];

function loadAppointments(){
  let items = JSON.parse(localStorage.getItem('glb_appointments') || 'null');
  if(!items){ items = sampleAppointments; localStorage.setItem('glb_appointments', JSON.stringify(items)); }
  return items;
}
function saveAppointments(items){ localStorage.setItem('glb_appointments', JSON.stringify(items)); }

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
  const orders = JSON.parse(localStorage.getItem('glb_orders') || '[]');
  if(!orders.length){ body.innerHTML = '<tr><td colspan="7">No product orders yet. Place a test order from the products page.</td></tr>'; return; }
  body.innerHTML = orders.map((o,i)=>`<tr><td>${o.id}<br><small>${o.created}</small></td><td>${o.customer}<br><small>${o.phone}</small></td><td>${o.items.map(x=>`${x.name} x ${x.qty}`).join('<br>')}</td><td>£${Number(o.total).toFixed(2)}</td><td>${o.payment}</td><td><select onchange="updateOrderStatus(${i}, this.value)"><option ${o.status==='Pending Payment'?'selected':''}>Pending Payment</option><option ${o.status==='Paid'?'selected':''}>Paid</option><option ${o.status==='Dispatched'?'selected':''}>Dispatched</option><option ${o.status==='Cancelled'?'selected':''}>Cancelled</option></select></td><td><button class="table-btn" onclick="deleteOrder(${i})">Delete</button></td></tr>`).join('');
}
function updateOrderStatus(i,status){ const orders=JSON.parse(localStorage.getItem('glb_orders')||'[]'); orders[i].status=status; localStorage.setItem('glb_orders',JSON.stringify(orders)); renderOrders(); }
function deleteOrder(i){ const orders=JSON.parse(localStorage.getItem('glb_orders')||'[]'); orders.splice(i,1); localStorage.setItem('glb_orders',JSON.stringify(orders)); renderOrders(); }

renderAppointments();
renderOrders();
