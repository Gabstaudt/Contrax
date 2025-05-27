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
  .replace('{{contratos}}', 'active')
  .replace('{{upload}}', '')
  .replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;
console.log('[✔] Sidebar carregada e atualizada');

document.querySelector('.novo-contrato-btn').addEventListener('click', () => {
  document.getElementById('modalNovoContrato').style.display = 'flex';
  document.getElementById('data_criacao').value = new Date().toISOString().split('T')[0];
  carregarPastas(); // Chamar para preencher o select
});

document.getElementById('btnCriarPasta').addEventListener('click', () => {
  const campos = document.getElementById('novaPastaCampos');
  campos.style.display = campos.style.display === 'none' ? 'block' : 'none';
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
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    });
    const result = await response.json();

    if (response.ok) {
      alert('Contrato salvo com sucesso!');
      fecharModal();
      form.reset();
      carregarPastasNaTela(); // Atualiza a grid após salvar
    } else {
      alert('Erro ao salvar contrato: ' + (result.mensagem || 'Erro desconhecido.'));
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro inesperado ao salvar contrato.');
  }
});

async function carregarPastas() {
  try {
    const res = await fetch('http://localhost:3000/pastas', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const pastas = await res.json();
    const select = document.getElementById('pasta');
    select.innerHTML = '<option value="">-- Selecione uma pasta --</option>'; // Limpa opções antigas
    pastas.forEach(pasta => {
      const opt = document.createElement('option');
      opt.value = pasta.id;
      opt.textContent = pasta.titulo;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Erro ao carregar pastas (select):', err);
  }
}

async function carregarPastasNaTela() {
  try {
    const res = await fetch('http://localhost:3000/pastas', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const pastas = await res.json();
    const grid = document.getElementById('pastaGrid');
    grid.innerHTML = '';

    if (pastas.length === 0) {
      grid.innerHTML = '<p>Nenhuma pasta encontrada.</p>';
      return;
    }

    pastas.forEach(pasta => {
      const card = document.createElement('div');
      card.classList.add('pasta-card');
      card.innerHTML = `
        <div class="pasta-conteudo">
          <img src="../assets/folder.svg" class="pasta-icone" />
          <div class="pasta-texto">
            <h2 class="pasta-nome">${pasta.titulo}</h2>
            <p class="pasta-descricao">${pasta.descricao || 'Sem descrição'}</p>
            <p class="pasta-quantidade">${pasta.contratoCount || 0} contratos</p>
          </div>
        </div>
        <p class="pasta-status ativo">${pasta.status || 'Em uso'}</p>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Erro ao carregar pastas (grid):', err);
  }
}
// Botão que abre o modal de nova pasta
document.querySelector('.nova-pasta-btn').addEventListener('click', () => {
  document.getElementById('modalNovaPasta').style.display = 'flex';
});

function fecharModalNovaPasta() {
  document.getElementById('modalNovaPasta').style.display = 'none';
}

document.getElementById('formNovaPasta').addEventListener('submit', async (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:3000/pastas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ titulo, descricao })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Pasta criada com sucesso!');
      fecharModalNovaPasta();
      carregarPastasNaTela(); // Atualiza a grid
    } else {
      alert('Erro ao criar pasta: ' + (result.error || 'Erro desconhecido.'));
    }
  } catch (err) {
    console.error('Erro ao criar pasta:', err);
    alert('Erro inesperado ao criar pasta.');
  }
});


carregarPastasNaTela();
