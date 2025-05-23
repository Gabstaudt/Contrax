
export async function loadSidebar(active = '') {
  let html = await fetch('sidebar/side.html').then(res => res.text());

  html = html
    .replace('{{dashboard}}', active === 'dashboard' ? 'active' : '')
    .replace('{{contratos}}', active === 'contratos' ? 'active' : '')
    .replace('{{upload}}', active === 'upload' ? 'active' : '')
    .replace('{{conta}}', active === 'conta' ? 'active' : '');

  document.getElementById('sidebar-container').innerHTML = html;
}
