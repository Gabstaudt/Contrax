
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email === "gabimstaudt@gmail.com" && senha === "gabi123") {
      window.location.href = "/inicial/inicial.html"; 
    } else {
      alert("Email ou senha incorretos.");
    }
  });

