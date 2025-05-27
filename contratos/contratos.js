let idPastaParaExcluir = null;  

// Função para carregar componentes HTML (Navbar e Sidebar)
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

// Funções de navegação
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

function ativarLinksNavbar(navItems) {
  navItems.forEach((item) => {
    const label = item.querySelector('.label')?.textContent?.trim();
    item.addEventListener('click', () => {
      switch (label) {
        case 'Dashboard':
          window.location.href = '../inicial/inicial.html'; break;
        case 'Contratos':
          window.location.href = '../contratos/contratos.html'; break;
        case 'Upload':
          window.location.href = '../upload/upload.html'; break;
        case 'Minha Conta':
          window.location.href = '../user/user.html'; break;
        default:
          console.warn(`[⚠️] Label desconhecido: ${label}`);
      }
    });
  });
}

// Carregamento inicial
await loadComponent('navbar-container', '../navbar/nav.html');
waitForNavbarReady(ativarLinksNavbar);
let sidebar = await fetch('../sidebar/side.html').then(res => res.text());
sidebar = sidebar.replace('{{dashboard}}', '').replace('{{contratos}}', 'active').replace('{{upload}}', '').replace('{{conta}}', '');
document.getElementById('sidebar-container').innerHTML = sidebar;
console.log('[✔] Sidebar carregada e atualizada');

// Modal Novo Contrato
document.querySelector('.novo-contrato-btn').addEventListener('click', () => {
  document.getElementById('modalNovoContrato').style.display = 'flex';
  document.getElementById('data_criacao').value = new Date().toISOString().split('T')[0];
  carregarPastas();
});
document.getElementById('btnCriarPasta').addEventListener('click', () => {
  const campos = document.getElementById('novaPastaCampos');
  campos.style.display = campos.style.display === 'none' ? 'block' : 'none';
});
function fecharModal() { document.getElementById('modalNovoContrato').style.display = 'none'; }

// Formulário de novo contrato
document.getElementById('formNovoContrato').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = document.getElementById('formNovoContrato');
  const formData = new FormData(form);
  const token = localStorage.getItem('token');

  // Verifica se a opção de criar pasta está visível
  const novaPastaCampos = document.getElementById('novaPastaCampos');
  if (novaPastaCampos.style.display === 'block') {
    const novaPastaTitulo = document.getElementById('novaPastaTitulo').value.trim();
    const novaPastaDescricao = document.getElementById('novaPastaDescricao').value.trim();

    if (!novaPastaTitulo) {
      alert('Por favor, insira o título da nova pasta.');
      return;
    }

    try {
      // Cria a nova pasta no backend
      const responsePasta = await fetch('http://localhost:3000/pastas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ titulo: novaPastaTitulo, descricao: novaPastaDescricao })
      });

      const resultPasta = await responsePasta.json();
      if (!responsePasta.ok) {
        alert('Erro ao criar a nova pasta: ' + (resultPasta.error || 'Erro desconhecido'));
        return;
      }

      // Define o ID da nova pasta no campo select
      formData.set('pasta', resultPasta.id);
    } catch (err) {
      console.error('Erro ao criar nova pasta:', err);
      alert('Erro inesperado ao criar nova pasta.');
      return;
    }
  }

  try {
    // Agora cria o contrato com o FormData (já atualizado com a pasta, se criada)
    const responseContrato = await fetch('http://localhost:3000/contratos', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    });

    const resultContrato = await responseContrato.json();
    if (responseContrato.ok) {
      alert('Contrato salvo com sucesso!');
      fecharModal();
      form.reset();
      carregarPastasNaTela();
    } else {
      alert('Erro ao salvar contrato: ' + (resultContrato.mensagem || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro ao salvar contrato:', error);
    alert('Erro inesperado ao salvar contrato.');
  }
});


// Carregar pastas no select do modal contrato
async function carregarPastas() {
  try {
    const res = await fetch('http://localhost:3000/pastas', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const pastas = await res.json();
    const select = document.getElementById('pasta');
    select.innerHTML = '<option value="">-- Selecione uma pasta --</option>';
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

// Carregar pastas na grid
async function carregarPastasNaTela() {
  try {
    const res = await fetch('http://localhost:3000/pastas', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const pastas = await res.json();
    const grid = document.getElementById('pastaGrid');
    grid.innerHTML = pastas.length === 0 ? '<p>Nenhuma pasta encontrada.</p>' : '';

   pastas.forEach(pasta => {
  const card = document.createElement('div');
  card.classList.add('pasta-card');
  card.innerHTML = `
    <div class="pasta-conteudo">
      <img src="../assets/folder.svg" class="pasta-icone" />
      <div class="pasta-texto">
        <h2 class="pasta-nome">${pasta.titulo}</h2>
        <p class="pasta-descricao">${pasta.descricao || 'Sem descrição'}</p>
        <p class="pasta-quantidade">${pasta.totalContratos} contratos</p>
        <p>
          ${pasta.ativos ? `<span style="color: #4CAF50">${pasta.ativos} ativos</span><br>` : ''}
          ${pasta.aVencer ? `<span style="color: #FB6A00">${pasta.aVencer} a vencer</span><br>` : ''}
          ${pasta.vencidos ? `<span style="color: #DC2626">${pasta.vencidos} vencidos</span>` : ''}
        </p>
      </div>
    </div>
    <div class="pasta-acoes">
      <img src="../assets/img/dots.svg" class="icone-acoes" data-id="${pasta.id}" />
      <div class="menu-acoes" style="display: none;">
        <button onclick="editarPasta(${pasta.id}, '${pasta.titulo}', '${pasta.descricao}')">Editar</button>
        <button onclick="abrirModalConfirmacao(${pasta.id})">Excluir</button>
      </div>
    </div>
  `;
  
  // Adicionar evento de clique para abrir contabt.html com o id da pasta
  card.addEventListener('click', () => {
  window.location.href = `../contabt/contabt.html?id=${pasta.id}&titulo=${encodeURIComponent(pasta.titulo)}`;
  });



  grid.appendChild(card);
});




    document.querySelectorAll('.icone-acoes').forEach(icone => {
      icone.addEventListener('click', (e) => {
        const menu = icone.nextElementSibling;
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
      });
    });
    window.addEventListener('click', () => {
      document.querySelectorAll('.menu-acoes').forEach(menu => menu.style.display = 'none');
    });
  } catch (err) {
    console.error('Erro ao carregar pastas (grid):', err);
  }
}

// CRUD de pasta (Editar e Excluir)
function editarPasta(id, titulo, descricao) {
  const novoTitulo = prompt('Editar título da pasta:', titulo);
  const novaDescricao = prompt('Editar descrição da pasta:', descricao);
  if (novoTitulo !== null) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/pastas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
    })
    .then(res => res.json())
    .then(result => {
      if (result.id) { alert('Pasta atualizada!'); carregarPastasNaTela(); }
      else { alert('Erro ao atualizar pasta.'); }
    })
    .catch(err => { console.error('Erro ao atualizar pasta:', err); alert('Erro inesperado.'); });
  }
}

// Modal de nova pasta
document.querySelector('.nova-pasta-btn').addEventListener('click', () => {
  document.getElementById('modalNovaPasta').style.display = 'flex';
});
function fecharModalNovaPasta() { document.getElementById('modalNovaPasta').style.display = 'none'; }
document.getElementById('formNovaPasta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:3000/pastas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ titulo, descricao })
    });
    const result = await response.json();
    if (response.ok) { alert('Pasta criada com sucesso!'); fecharModalNovaPasta(); carregarPastasNaTela(); }
    else { alert('Erro ao criar pasta: ' + (result.error || 'Erro desconhecido.')); }
  } catch (err) { console.error('Erro ao criar pasta:', err); alert('Erro inesperado ao criar pasta.'); }
});

// Confirmação de exclusão
function abrirModalConfirmacao(id) {
  idPastaParaExcluir = id;
  document.getElementById('modalConfirmacao').style.display = 'flex';
}
function fecharModalConfirmacao() {
  document.getElementById('modalConfirmacao').style.display = 'none';
  idPastaParaExcluir = null;
}
document.getElementById('confirmarExclusao').addEventListener('click', async () => {
  if (idPastaParaExcluir) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/pastas/${idPastaParaExcluir}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      const result = await res.json();
      if (res.ok) { alert('Pasta excluída com sucesso!'); fecharModalConfirmacao(); carregarPastasNaTela(); }
      else { alert('Erro ao excluir: ' + (result.error || 'Erro desconhecido.')); }
    } catch (err) { console.error('Erro ao excluir pasta:', err); alert('Erro inesperado.'); }
  }
});

// Listener para fechar modais (qualquer X)
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.style.display = 'none');
  });
});

// Expor função para HTML
window.abrirModalConfirmacao = abrirModalConfirmacao;
carregarPastasNaTela();
