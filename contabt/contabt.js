// contabt.js

// Função para carregar HTML de componente
async function loadComponent(id, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// Carrega navbar
await loadComponent('navbar-container', '../navbar/nav.html');

// Ativa redirecionamentos da navbar
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      const label = item.querySelector(".label")?.textContent?.trim();
      item.addEventListener("click", () => {
        switch (label) {
          case "Dashboard":
            window.location.href = "../inicial/inicial.html";
            break;
          case "Contratos":
            window.location.href = "../contratos/contratos.html";
            break;
          case "Upload":
            window.location.href = "../upload/upload.html";
            break;
          case "Minha Conta":
            window.location.href = "../user/user.html";
            break;
        }
      });
    });
  }, 0);
});

// Carrega sidebar com "Contratos" ativo
let sidebar = await fetch('../sidebar/side.html').then(res => res.text());
sidebar = sidebar
  .replace('{{dashboard}}', '')
  .replace('{{contratos}}', 'active')
  .replace('{{upload}}', '')
  .replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;
