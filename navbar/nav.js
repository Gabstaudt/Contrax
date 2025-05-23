

export async function loadNavbar() {
  const html = await fetch('navbar/nav.html').then(res => res.text());
  document.getElementById('navbar-container').innerHTML = html;

  
  attachNavItemListeners();
}

function attachNavItemListeners() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    const label = item.querySelector(".label")?.textContent?.trim();

    item.addEventListener("click", () => {
      switch (label) {
        case "Dashboard":
          if (!location.href.includes("inicial")) {
            window.location.href = "../inicial/inicial.html";
          }
          break;
        case "Contratos":
          if (!location.href.includes("contratos")) {
            window.location.href = "../contratos/contratos.html";
          }
          break;
        case "Upload":
          if (!location.href.includes("upload")) {
            window.location.href = "../upload/upload.html";
          }
          break;
        case "Minha Conta":
          if (!location.href.includes("user")) {
            window.location.href = "../user/user.html";
          }
          break;
      }
    });
  });
}
