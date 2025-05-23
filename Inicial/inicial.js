// inicial.js

// Função para carregar HTML em um container
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

// Aguarda navbar ser carregada e ativa os links
function waitForNavbarReady(callback) {
  const check = () => {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      callback(navItems);
    } else {
      requestAnimationFrame(check);
    }
  };
  requestAnimationFrame(check);
}

// Define os redirecionamentos
function ativarLinksNavbar(navItems) {
  navItems.forEach((item) => {
    const label = item.querySelector('.label')?.textContent?.trim();
    item.addEventListener('click', () => {
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
      }
    });
  });
}

// INÍCIO DO SCRIPT
await loadComponent('navbar-container', '../navbar/nav.html');
waitForNavbarReady(ativarLinksNavbar);

// Sidebar com destaque no "Dashboard"
let sidebar = await fetch('../sidebar/side.html').then(res => res.text());
sidebar = sidebar
  .replace('{{dashboard}}', 'active')
  .replace('{{contratos}}', '')
  .replace('{{upload}}', '')
  .replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;
