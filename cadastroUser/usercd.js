document.getElementById('cadastroUsuarioForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const confirmar = document.getElementById('confirmar').value;
  const codigo = document.getElementById('codigo').value;

  if (senha !== confirmar) {
    alert('As senhas não coincidem.');
    return;
  }

  if (codigo !== '13102003') {
    alert('Código da empresa inválido.');
    return;
  }

  const dados = {
    nome,
    email,
    senha,
    tipo: 'comum',
    codigo  // 💥 Agora o campo código está incluso
  };

  try {
    const resposta = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (resposta.ok) {
      const json = await resposta.json();
      alert('Cadastro realizado com sucesso!');
      console.log(json);
      window.location.href = '/index.html';
    } else {
      const erro = await resposta.json();
      console.error('Erro ao cadastrar:', erro);
      alert(`Erro ao cadastrar: ${erro.detalhes || erro.error || resposta.status}`);
    }
  } catch (err) {
    console.error('Erro na requisição:', err);
    alert('Erro na conexão com o servidor. Verifique se o backend está online.');
  }
});
