
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Impede envio padrão do formulário

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email === "gabimstaudt@gmail.com" && senha === "gabi123") {
      window.location.href = "/inicial/inicial.html"; // redireciona para o dashboard
    } else {
      alert("Email ou senha incorretos.");
    }
  });

