function choosePlan(plan){
  const select = document.getElementById('plan');
  select.value = plan;
  document.getElementById('apply').scrollIntoView({behavior:'smooth'});
}
function sendWhatsApp(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const area = document.getElementById('area').value;
  const plan = document.getElementById('plan').value;
  const msg = `Hello Rao Brothers,%0A%0AI want a new internet connection.%0A%0AName: ${encodeURIComponent(name)}%0AMobile: ${encodeURIComponent(mobile)}%0AArea: ${encodeURIComponent(area)}%0APlan: ${encodeURIComponent(plan)}%0A%0APlease check availability and contact me.`;
  window.open(`https://wa.me/917480080000?text=${msg}`,'_blank');
}
