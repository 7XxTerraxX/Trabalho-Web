/* ===== NEXUS PLAY - Cadastro de membros ===== */

const CHAVE_MEMBROS = "nexus_membros";

let membros = [];

try {
  const bruto = localStorage.getItem(CHAVE_MEMBROS);
  if (bruto) {
    const dados = JSON.parse(bruto);
    membros = Array.isArray(dados) ? dados : [];
  }
} catch (erro) {
  localStorage.removeItem(CHAVE_MEMBROS);
  membros = [];
}

function renderizarMembros() {
  const lista = document.getElementById("lista-membros");
  if (!lista) return;

  lista.innerHTML = "";

  if (membros.length === 0) {
    lista.innerHTML = "<p class='text-muted small'>Nenhum membro cadastrado ainda.</p>";
    return;
  }

  membros.forEach(function (membro) {
    const item = document.createElement("div");
    item.className = "d-flex justify-content-between align-items-center p-3 rounded";
    item.style.backgroundColor = "var(--card)";
    item.style.border = "1px solid var(--borda)";
    item.innerHTML =
      "<div><strong>" + membro.nome + "</strong><br>" +
      "<small class='text-secondary'>" + membro.email + " · " + membro.plataforma + "</small></div>";

    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-danger";
    btn.textContent = "Excluir";
    btn.addEventListener("click", function () {
      const posicao = membros.indexOf(membro);
      if (posicao !== -1) {
        membros.splice(posicao, 1);
      }
      localStorage.setItem(CHAVE_MEMBROS, JSON.stringify(membros));
      renderizarMembros();
    });

    item.appendChild(btn);
    lista.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarMembros();

  const form = document.getElementById("form-cadastro");

  if (form) {
    form.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const novoMembro = {
        nome: document.getElementById("cad-nome").value,
        email: document.getElementById("cad-email").value,
        plataforma: document.getElementById("cad-plataforma").value,
        nascimento: document.getElementById("cad-nascimento").value
      };

      membros.push(novoMembro);
      localStorage.setItem(CHAVE_MEMBROS, JSON.stringify(membros));

      renderizarMembros();
      form.reset();
      exibirAlerta("Cadastro realizado com sucesso!", "success");
    });
  }

  const btnLimpar = document.getElementById("btn-limpar-membros");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", function () {
      membros = [];
      localStorage.setItem(CHAVE_MEMBROS, JSON.stringify(membros));
      renderizarMembros();
      exibirAlerta("Lista de membros limpa.", "warning");
    });
  }
});