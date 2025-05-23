document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login bem-sucedido!');
      localStorage.setItem('token', data.token);
      window.location.href = './Inicial/inicial.html'; 
    } else {
      alert(data.mensagem || 'Falha no login.');
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
    console.error(err);
  }
});
