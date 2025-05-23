
async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    console.log(`[✔] Componente carregado em #${id} via ${path}`);
  } catch (err) {
    console.error(`[❌] Erro ao carregar ${path}:`, err);
  }
}


function waitForNavbarReady(callback) {
  const check = () => {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      console.log(`[✔] ${navItems.length} itens da navbar encontrados`);
      callback(navItems);
    } else {
      requestAnimationFrame(check);
    }
  };
  requestAnimationFrame(check);
}


function ativarLinksNavbar(navItems) {
  navItems.forEach((item) => {
    const label = item.querySelector('.label')?.textContent?.trim();
    console.log(`[🟡] Registrando listener para: ${label}`);

    item.addEventListener('click', () => {
      console.log(`[🟢] Clicado: ${label}`);

      switch (label) {
        case 'Dashboard':
          window.location.href = '../inicial/inicial.html';
          break;
        case 'Contratos':
          window.location.href = '../contratos/contratos.html';
          break;
        case 'Upload':
          window.location.href = '../upload/upload.html';
          break;
        case 'Minha Conta':
          window.location.href = '../user/user.html';
          break;
        default:
          console.warn(`[⚠️] Label desconhecido: ${label}`);
      }
    });
  });
}


await loadComponent('navbar-container', '../navbar/nav.html');
waitForNavbarReady(ativarLinksNavbar);


let sidebar = await fetch('../sidebar/side.html').then(res => res.text());
sidebar = sidebar
  .replace('{{dashboard}}', '')
  .replace('{{contratos}}', '')
  .replace('{{upload}}', 'active')
  .replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;
console.log('[✔] Sidebar carregada e atualizada');
