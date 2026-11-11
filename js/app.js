/* ===== NEXUS PLAY - Script principal ===== */

const CHAVE_CARRINHO = "nexus_carrinho";
const CHAVE_FAVORITOS = "nexus_favoritos";

function lerStorage(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return padrao;
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? dados : padrao;
  } catch (erro) {
    localStorage.removeItem(chave);
    return padrao;
  }
}

let carrinho = lerStorage(CHAVE_CARRINHO, []);
let favoritos = lerStorage(CHAVE_FAVORITOS, []);

const catalogo = [
  { id: 1, nome: "Grand Theft Auto", preco: 249.9, categoria: "Ação" },
  { id: 2, nome: "Forza Horizon", preco: 179.9, categoria: "Corrida" },
  { id: 3, nome: "The Last of Us", preco: 199.9, categoria: "Aventura" },
  { id: 4, nome: "FNAF", preco: 25.0, categoria: "Indie" },
  { id: 5, nome: "Coffee Talk", preco: 39.9, categoria: "Indie" },
  { id: 6, nome: "Hi-fi RUSH", preco: 150.0, categoria: "Ação" },
  { id: 7, nome: "PlayStation 5 Slim", preco: 3799.0, categoria: "Console" },
  { id: 8, nome: "Xbox Series X", preco: 4299.0, categoria: "Console" },
  { id: 9, nome: "Nintendo Switch OLED", preco: 2499.0, categoria: "Console" },
  { id: 10, nome: "Steam Deck OLED", preco: 3199.0, categoria: "Console" }
];

function salvarCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  atualizarContador();
}

function salvarFavoritos() {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

function atualizarContador() {
  const badges = document.querySelectorAll("#contador-carrinho");
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total += Number(carrinho[i].quantidade) || 0;
  }
  badges.forEach(function (badge) {
    badge.textContent = total;
  });
}

function adicionarAoCarrinho(id) {
  const produto = catalogo.find(function (item) { return item.id === id; });

  if (!produto) {
    exibirAlerta("Produto não encontrado no catálogo.", "danger");
    return;
  }

  const existente = carrinho.find(function (item) { return item.id === id; });

  if (existente) {
    existente.quantidade = (Number(existente.quantidade) || 0) + 1;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }

  salvarCarrinho();
  renderizarCarrinho();
  exibirAlerta(produto.nome + " adicionado ao carrinho!", "success");
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(function (item) { return item.id !== id; });
  salvarCarrinho();
  renderizarCarrinho();
}

function calcularTotal() {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total += carrinho[i].preco * carrinho[i].quantidade;
  }
  return total;
}

function renderizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const totalEl = document.getElementById("total-carrinho");
  if (!lista) return;

  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = "<p class='text-muted mb-0'>Seu carrinho está vazio.</p>";
  } else {
    carrinho.forEach(function (item) {
      const linha = document.createElement("div");
      linha.className = "d-flex justify-content-between align-items-center border-bottom py-2 gap-2";

      const info = document.createElement("span");
      info.innerHTML = item.nome + " <small class='text-muted'>x" + item.quantidade + "</small>";

      const valor = document.createElement("span");
      valor.className = "preco";
      valor.textContent = "R$ " + (item.preco * item.quantidade).toFixed(2);

      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-outline-danger";
      btn.textContent = "Remover";
      btn.addEventListener("click", function () { removerDoCarrinho(item.id); });

      linha.appendChild(info);
      linha.appendChild(valor);
      linha.appendChild(btn);
      lista.appendChild(linha);
    });
  }

  if (totalEl) totalEl.textContent = "R$ " + calcularTotal().toFixed(2);
}

function exibirAlerta(mensagem, tipo) {
  const area = document.getElementById("area-alertas");
  if (!area) return;

  const div = document.createElement("div");
  div.className = "alert alert-" + tipo + " alert-dismissible fade show";
  div.setAttribute("role", "alert");
  div.innerHTML = mensagem +
    "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Fechar'></button>";
  area.appendChild(div);

  setTimeout(function () {
    if (div.parentNode) div.remove();
  }, 3000);
}

function filtrarJogos() {
  const campo = document.getElementById("campo-busca");
  if (!campo) return;

  const termo = campo.value.toLowerCase();
  const cards = document.querySelectorAll(".card-game");

  cards.forEach(function (card) {
    const nome = (card.getAttribute("data-nome") || "").toLowerCase();
    card.parentElement.style.display = nome.indexOf(termo) !== -1 ? "" : "none";
  });
}

function alternarFavorito(id, elemento) {
  const indice = favoritos.indexOf(id);

  if (indice === -1) {
    favoritos.push(id);
    elemento.textContent = "Favoritado";
    elemento.classList.add("favoritado");
  } else {
    favoritos.splice(indice, 1);
    elemento.textContent = "Favoritar";
    elemento.classList.remove("favoritado");
  }

  salvarFavoritos();
  renderizarFavoritos();
}

function restaurarFavoritos() {
  const botoes = document.querySelectorAll("[data-favorito]");
  botoes.forEach(function (botao) {
    const id = parseInt(botao.getAttribute("data-favorito"), 10);
    if (favoritos.indexOf(id) !== -1) {
      botao.textContent = "Favoritado";
      botao.classList.add("favoritado");
    }
  });
}

function renderizarFavoritos() {
  const lista = document.getElementById("lista-favoritos");
  if (!lista) return;

  lista.innerHTML = "";

  if (favoritos.length === 0) {
    lista.innerHTML = "<p class='text-muted small'>Nenhum jogo favoritado ainda.</p>";
    return;
  }

  favoritos.forEach(function (id) {
    const produto = catalogo.find(function (item) { return item.id === id; });
    if (!produto) return;

    const coluna = document.createElement("div");
    coluna.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "p-3 rounded h-100";
    card.style.backgroundColor = "var(--card)";
    card.style.border = "1px solid var(--borda)";

    const titulo = document.createElement("h3");
    titulo.className = "h6 mb-1";
    titulo.textContent = produto.nome;

    const categoria = document.createElement("p");
    categoria.className = "text-secondary small mb-2";
    categoria.textContent = produto.categoria;

    const preco = document.createElement("p");
    preco.className = "preco mb-2";
    preco.textContent = "R$ " + produto.preco.toFixed(2);

    const btn = document.createElement("button");
    btn.className = "btn btn-limao btn-sm";
    btn.type = "button";
    btn.textContent = "Remover";
    btn.addEventListener("click", function () {
      alternarFavorito(id, btn);
      renderizarFavoritos();
    });

    card.appendChild(titulo);
    card.appendChild(categoria);
    card.appendChild(preco);
    card.appendChild(btn);
    coluna.appendChild(card);
    lista.appendChild(coluna);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarContador();
  renderizarCarrinho();
  restaurarFavoritos();
  renderizarFavoritos();

  const botoes = document.querySelectorAll("[data-add]");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function (evento) {
      evento.preventDefault();
      const id = parseInt(botao.getAttribute("data-add"), 10);
      adicionarAoCarrinho(id);
    });
  });

  const botoesFavorito = document.querySelectorAll("[data-favorito]");
  botoesFavorito.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const id = parseInt(botao.getAttribute("data-favorito"), 10);
      alternarFavorito(id, botao);
    });
  });

  const campoBusca = document.getElementById("campo-busca");
  if (campoBusca) campoBusca.addEventListener("input", filtrarJogos);

  const formContato = document.getElementById("form-contato");
  if (formContato) {
    formContato.addEventListener("submit", function (evento) {
      evento.preventDefault();
      exibirAlerta("Mensagem enviada com sucesso! Responderemos em até 24h.", "success");
      formContato.reset();
    });
  }
});