/* ===== NEXUS PLAY - FAQ (JS puro) ===== */

const perguntas = [
  {
    pergunta: "Qual é o prazo de entrega?",
    resposta: "Para Marechal e região, a entrega ocorre em até 2 dias úteis. Para as demais regiões do Brasil, o prazo varia entre 4 e 9 dias úteis, conforme o CEP informado no checkout."
  },
  {
    pergunta: "Os consoles têm garantia oficial?",
    resposta: "Sim. Todos os consoles novos acompanham 12 meses de garantia do fabricante, além dos 90 dias de garantia legal previstos no Código de Defesa do Consumidor."
  },
  {
    pergunta: "Posso trocar um jogo aberto?",
    resposta: "Jogos com lacre violado só podem ser trocados em caso de defeito de fabricação, mediante análise da nossa equipe técnica em até 7 dias após o recebimento."
  },
  {
    pergunta: "Vocês parcelam no cartão?",
    resposta: "Sim, em até 12 vezes sem juros em compras acima de R$ 500,00. Também aceitamos Pix com 5% de desconto adicional."
  },
  {
    pergunta: "Como funciona o programa de membros?",
    resposta: "Membros cadastrados recebem 5% de desconto em jogos, acesso antecipado a lançamentos e convites para torneios exclusivos da loja."
  },
  {
    pergunta: "A loja física tem estações de teste?",
    resposta: "Temos quatro estações com PS5, Xbox Series X, Switch e PC, disponíveis gratuitamente por 30 minutos mediante agendamento no balcão."
  }
];

function criarItemFaq(item) {
  const artigo = document.createElement("article");
  artigo.className = "item-faq";

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "pergunta";

  const texto = document.createElement("span");
  texto.textContent = item.pergunta;

  const icone = document.createElement("span");
  icone.className = "icone";
  icone.textContent = "+";

  botao.appendChild(texto);
  botao.appendChild(icone);

  const resposta = document.createElement("div");
  resposta.className = "resposta";

  const paragrafo = document.createElement("p");
  paragrafo.textContent = item.resposta;
  resposta.appendChild(paragrafo);

  botao.addEventListener("click", function () {
    const jaAberto = artigo.classList.contains("aberto");

    document.querySelectorAll(".item-faq").forEach(function (outro) {
      outro.classList.remove("aberto");
      const ic = outro.querySelector(".icone");
      if (ic) ic.textContent = "+";
    });

    if (!jaAberto) {
      artigo.classList.add("aberto");
      icone.textContent = "−";
    }
  });

  artigo.appendChild(botao);
  artigo.appendChild(resposta);

  return artigo;
}

function renderizarFaq(termo) {
  const lista = document.getElementById("lista-faq");
  if (!lista) return;

  lista.innerHTML = "";

  const busca = (termo || "").toLowerCase().trim();
  let encontrados = 0;

  for (let i = 0; i < perguntas.length; i++) {
    const item = perguntas[i];
    const conteudo = (item.pergunta + " " + item.resposta).toLowerCase();

    if (busca !== "" && conteudo.indexOf(busca) === -1) {
      continue;
    }

    encontrados++;
    lista.appendChild(criarItemFaq(item));
  }

  if (encontrados === 0) {
    const aviso = document.createElement("p");
    aviso.style.color = "#9a9ab0";
    aviso.textContent = "Nenhuma pergunta encontrada para este termo.";
    lista.appendChild(aviso);
  }
}

function atualizarBadgeCarrinho() {
  const badge = document.getElementById("contador-carrinho");
  if (!badge) return;

  let carrinho = [];
  try {
    carrinho = JSON.parse(localStorage.getItem("nexus_carrinho")) || [];
  } catch (erro) {
    carrinho = [];
  }

  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total += Number(carrinho[i].quantidade) || 0;
  }

  badge.textContent = total;
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarFaq("");
  atualizarBadgeCarrinho();

  const busca = document.getElementById("busca");
  if (busca) {
    busca.addEventListener("input", function () {
      renderizarFaq(busca.value);
    });
  }

  const retorno = document.getElementById("retorno-avaliacao");
  const btnSim = document.getElementById("btn-sim");
  const btnNao = document.getElementById("btn-nao");

  if (btnSim && retorno) {
    btnSim.addEventListener("click", function () {
      retorno.textContent = "Que bom! Obrigado pelo retorno.";
    });
  }

  if (btnNao && retorno) {
    btnNao.addEventListener("click", function () {
      retorno.textContent = "Sem problemas. Fale com nosso suporte pela página de contato.";
    });
  }
});