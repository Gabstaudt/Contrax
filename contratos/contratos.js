

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

// Eventos de clique após a navbar estar pronta
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
  .replace('{{contratos}}', 'active')
  .replace('{{upload}}', '')
  .replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;
console.log('[✔] Sidebar carregada e atualizada');

document.querySelector('.nova-pasta-btn').addEventListener('click', () => {
    document.getElementById('modalNovoContrato').style.display = 'flex';
    document.getElementById('data_criacao').value = new Date().toISOString().split('T')[0];
  });

  function fecharModal() {
    document.getElementById('modalNovoContrato').style.display = 'none';
  }

  document.getElementById('formNovoContrato').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('formNovoContrato');
    const formData = new FormData(form);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/contratos', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Contrato salvo com sucesso!');
        fecharModal();
        form.reset();
      } else {
        alert('Erro ao salvar contrato: ' + (result.mensagem || 'Erro desconhecido.'));
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro inesperado ao salvar contrato.');
    }
  });