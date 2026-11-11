/* ===== NEXUS PLAY - Ofertas (JS puro) ===== */

(function () {
  "use strict";

  if (window.__nexusOfertasIniciado) return;
  window.__nexusOfertasIniciado = true;

  var ofertas = [
    { id: 1, nome: "Grand Theft Auto", categoria: "Ação", precoAntigo: 249.9, precoNovo: 149.9, desconto: 40, imagem: "img/gta.png" },
    { id: 2, nome: "Forza Horizon", categoria: "Corrida", precoAntigo: 179.9, precoNovo: 89.9, desconto: 50, imagem: "img/forza.png" },
    { id: 3, nome: "The Last of Us", categoria: "Aventura", precoAntigo: 199.9, precoNovo: 129.9, desconto: 35, imagem: "img/tlast.png" },
    { id: 4, nome: "FNAF", categoria: "Indie", precoAntigo: 49.9, precoNovo: 25.0, desconto: 50, imagem: "img/fnaf.png" },
    { id: 5, nome: "Coffee Talk", categoria: "Indie", precoAntigo: 59.9, precoNovo: 39.9, desconto: 33, imagem: "img/coffe.png" },
    { id: 6, nome: "Hi-fi RUSH", categoria: "Ação", precoAntigo: 199.9, precoNovo: 150.0, desconto: 25, imagem: "img/wify.png" }
  ];

  function formatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
  }

  function lerCarrinho() {
    try {
      var dados = JSON.parse(localStorage.getItem("nexus_carrinho"));
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      return [];
    }
  }

  function salvarCarrinho(carrinho) {
    localStorage.setItem("nexus_carrinho", JSON.stringify(carrinho));
  }

  function adicionarOfertaAoCarrinho(oferta) {
    var carrinho = lerCarrinho();
    var existente = null;

    for (var i = 0; i < carrinho.length; i++) {
      if (carrinho[i].id === oferta.id) {
        existente = carrinho[i];
        break;
      }
    }

    if (existente) {
      existente.quantidade = (Number(existente.quantidade) || 0) + 1;
    } else {
      carrinho.push({
        id: oferta.id,
        nome: oferta.nome,
        preco: oferta.precoNovo,
        quantidade: 1
      });
    }

    salvarCarrinho(carrinho);
    atualizarBadgeCarrinho();
  }

  function renderizarOfertas(categoria) {
    var grade = document.getElementById("grade-ofertas");
    var contador = document.getElementById("resultado-filtro");
    if (!grade) return;

    var filtro = (categoria || "todas").trim();
    grade.innerHTML = "";

    var exibidas = 0;

    for (var i = 0; i < ofertas.length; i++) {
      var oferta = ofertas[i];

      if (filtro !== "todas" && oferta.categoria !== filtro) {
        continue;
      }

      exibidas++;

      var artigo = document.createElement("article");
      artigo.className = "oferta";

      var imagem = document.createElement("img");
      imagem.src = oferta.imagem;
      imagem.alt = "Imagem de " + oferta.nome;
      imagem.className = "oferta-img";
      artigo.appendChild(imagem);

      var selo = document.createElement("span");
      selo.className = "selo";
      selo.textContent = "-" + oferta.desconto + "%";
      artigo.appendChild(selo);

      var titulo = document.createElement("h3");
      titulo.textContent = oferta.nome;
      artigo.appendChild(titulo);

      var cat = document.createElement("span");
      cat.className = "categoria";
      cat.textContent = oferta.categoria;
      artigo.appendChild(cat);

      var antigo = document.createElement("span");
      antigo.className = "preco-antigo";
      antigo.textContent = formatarPreco(oferta.precoAntigo);
      artigo.appendChild(antigo);

      var novo = document.createElement("span");
      novo.className = "preco-novo";
      novo.textContent = formatarPreco(oferta.precoNovo);
      artigo.appendChild(novo);

      var botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = "Aproveitar";
      botao.setAttribute("data-oferta", oferta.id);

      botao.addEventListener("click", function () {
        var id = parseInt(this.getAttribute("data-oferta"), 10);
        var escolhida = null;

        for (var j = 0; j < ofertas.length; j++) {
          if (ofertas[j].id === id) {
            escolhida = ofertas[j];
            break;
          }
        }

        if (!escolhida) return;

        adicionarOfertaAoCarrinho(escolhida);

        this.textContent = "Adicionado";
        this.disabled = true;
        this.style.backgroundColor = "var(--limao)";
        this.style.color = "#0b0b0f";
      });

      artigo.appendChild(botao);
      grade.appendChild(artigo);
    }

    if (exibidas === 0) {
      grade.innerHTML = "<p style='color:#9a9ab0'>Nenhuma oferta nesta categoria.</p>";
    }

    if (contador) contador.textContent = exibidas + " oferta(s) encontrada(s)";
  }

  function iniciarTimer() {
    var alvo = new Date();
    alvo.setHours(23, 59, 59, 0);

    setInterval(function () {
      var agora = new Date();
      var diferenca = alvo - agora;
      var timer = document.getElementById("timer");
      if (!timer) return;

      if (diferenca <= 0) {
        timer.textContent = "00:00:00";
        return;
      }

      var horas = Math.floor(diferenca / 3600000);
      var minutos = Math.floor((diferenca % 3600000) / 60000);
      var segundos = Math.floor((diferenca % 60000) / 1000);

      function doisDigitos(n) {
        return n < 10 ? "0" + n : String(n);
      }

      timer.textContent = doisDigitos(horas) + ":" + doisDigitos(minutos) + ":" + doisDigitos(segundos);
    }, 1000);
  }

  function atualizarBadgeCarrinho() {
    var badge = document.getElementById("contador-carrinho");
    if (!badge) return;

    var carrinho = lerCarrinho();
    var total = 0;

    for (var i = 0; i < carrinho.length; i++) {
      total += Number(carrinho[i].quantidade) || 0;
    }

    badge.textContent = total;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderizarOfertas("todas");
    iniciarTimer();
    atualizarBadgeCarrinho();

    var filtro = document.getElementById("filtro-categoria");
    if (filtro) {
      filtro.addEventListener("change", function () {
        renderizarOfertas(filtro.value);
      });
    }
  });
})();