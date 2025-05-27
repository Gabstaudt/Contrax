async function loadComponent(id, path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Erro ao carregar ${path}`);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

await loadComponent('navbar-container', '../navbar/nav.html');

let sidebar = await fetch('../sidebar/side.html').then(res => res.text());
sidebar = sidebar.replace('{{dashboard}}', '').replace('{{contratos}}', 'active').replace('{{upload}}', '').replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;

function ativarEventosNavbar() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    const label = item.querySelector(".label")?.textContent?.trim();
    item.addEventListener("click", () => {
      switch (label) {
        case "Dashboard": window.location.href = "../inicial/inicial.html"; break;
        case "Contratos": window.location.href = "../contratos/contratos.html"; break;
        case "Upload": window.location.href = "../upload/upload.html"; break;
        case "Minha Conta": window.location.href = "../user/user.html"; break;
      }
    });
  });
}

function esperarNavbarPronta(callback) {
  const verificar = () => {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      callback();
    } else {
      requestAnimationFrame(verificar);
    }
  };
  requestAnimationFrame(verificar);
}

esperarNavbarPronta(ativarEventosNavbar);

// 🚀 Capturar o ID da pasta e título
const params = new URLSearchParams(window.location.search);
const pastaId = params.get('id');
const pastaTitulo = decodeURIComponent(params.get('titulo') || '');

// Atualiza título da pasta na tela
document.querySelector('.titulo-pasta').textContent = pastaTitulo || 'Pasta';

// 🚀 Carregar contratos da pasta
async function carregarContratos() {
  if (!pastaId) {
    console.error('ID da pasta não fornecido');
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/contratos/pasta/${pastaId}`); // ajuste aqui
    if (!resposta.ok) throw new Error('Erro na resposta do servidor');
    const contratos = await resposta.json();

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';  

    if (contratos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">Nenhum contrato encontrado nesta pasta.</td></tr>`;
      return;
    }

    contratos.forEach(contrato => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${contrato.nome}</td>
        <td>${contrato.data_vencimento || '-'}</td>
        <td>${contrato.data_criacao || '-'}</td>
        <td>R$ ${contrato.valor?.toFixed(2) || '0,00'}</td>
        <td><span class="status ${contrato.status || 'indefinido'}">${contrato.status || '-'}</span></td>
        <td>${contrato.partes ? contrato.partes.map(() => '👥').join('') : ''}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro ao carregar contratos:', err);
  }
}

carregarContratos();
