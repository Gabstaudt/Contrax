// usercd.js

document.getElementById('cadastroUsuarioForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Impede o comportamento padrão do formulário

  // Coleta os valores do formulário
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const confirmar = document.getElementById('confirmar').value.trim();
  const codigo = document.getElementById('codigo').value.trim();

  // Validação simples
  if (senha !== confirmar) {
    alert('As senhas não coincidem!');
    return;
  }

  if (codigo !== '13102003') {
    alert('Código da empresa inválido!');
    return;
  }

  // Criação do objeto de dados
  const dados = {
    nome,
    email,
    senha,
    codigo
  };

  try {
    // Envio para o servidor (ajuste a URL se necessário)
    const resposta = await fetch('http://localhost:3000/api/usuarios', {  // Troque pelo seu endpoint real
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      throw new Error(`Erro do servidor: ${erro}`);
    }

    const resultado = await resposta.json();
    console.log('Usuário cadastrado com sucesso:', resultado);
    alert('Cadastro realizado com sucesso!');
    document.getElementById('cadastroUsuarioForm').reset();

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    alert('Erro ao cadastrar usuário. Verifique a conexão e tente novamente.');
  }
});
