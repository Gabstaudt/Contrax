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

// Função para buscar e exibir contratos
async function carregarContratos() {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/contratos', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });

    const contratos = await res.json();
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    let totalAtivos = 0;
    let totalAvencer = 0;
    let totalVencidos = 0;

    contratos.forEach(contrato => {
      const row = document.createElement('tr');

      const partes = contrato.partes?.length || 1;
      const hoje = new Date();
      const vencimento = new Date(contrato.data_vencimento);
      const diasRestantes = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

      let statusDinamico = 'ativo';
      if (diasRestantes < 0) {
        statusDinamico = 'vencido';
        totalVencidos++;
      } else if (diasRestantes <= 5) {
        statusDinamico = 'avencer';
        totalAvencer++;
      } else {
        totalAtivos++;
      }

      const statusClasse = statusDinamico === 'vencido'
        ? 'vencido'
        : statusDinamico === 'avencer'
        ? 'avencer'
        : contrato.status === 'cancelado'
        ? 'inativo'
        : 'ativo';

      row.innerHTML = `
        <td>${contrato.nome}</td>
        <td>${new Date(contrato.data_vencimento).toLocaleDateString('pt-BR')}</td>
        <td>R$ ${Number(contrato.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
       <td><span class="status ${statusClasse}">
  ${statusClasse === 'avencer' ? 'A vencer' : statusClasse.charAt(0).toUpperCase() + statusClasse.slice(1)}
</span></td>

        <td>${'👥'.repeat(partes)}</td>
      `;

      tbody.appendChild(row);
    });

    // Atualiza os cards
    document.querySelector('.card.azul h2').textContent = totalAtivos;
    document.querySelector('.card.azul-claro h2').textContent = totalAvencer;
    document.querySelector('.card.laranja h2').textContent = totalVencidos;

  } catch (err) {
    console.error('Erro ao carregar contratos:', err);
  }
}

carregarContratos();
