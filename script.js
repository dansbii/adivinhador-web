let numeroSecreto;
let tentativas = 0;
let pontuacao = 0;
let jogoAtivo = false;
let pontuacaoPendente = 0;

const dificuldade = document.getElementById("dificuldade");
const palpite = document.getElementById("palpite");
const adivinhar = document.getElementById("adivinhar");
const novoJogo = document.getElementById("novoJogo");
const mensagem = document.getElementById("mensagem");
const tentativasTexto = document.getElementById("tentativas");
const pontuacaoTexto = document.getElementById("pontuacao");
const recordeTexto = document.getElementById("recorde");
const listaRanking = document.getElementById("listaRanking");
const nomeArea = document.getElementById("nomeArea");
const nomeJogador = document.getElementById("nomeJogador");
const salvarNome = document.getElementById("salvarNome");

let recorde = Number(localStorage.getItem("recorde")) || 0;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

recordeTexto.textContent = recorde;

function iniciarJogo() {
    const maximo = Number(dificuldade.value);

    numeroSecreto = Math.floor(Math.random() * maximo) + 1;
    tentativas = 0;
    pontuacao = maximo;
    jogoAtivo = true;

    tentativasTexto.textContent = tentativas;
    pontuacaoTexto.textContent = pontuacao;

    mensagem.className = "";
    mensagem.textContent = `Estou pensando em um número de 1 a ${maximo}.`;

    palpite.value = "";
    palpite.min = 1;
    palpite.max = maximo;

    nomeArea.classList.remove("visivel");

    palpite.focus();
}

function fazerPalpite() {
    if (!jogoAtivo) {
        mensagem.className = "";
        mensagem.textContent = "Clique em NOVO JOGO para começar.";
        return;
    }

    const valor = Number(palpite.value);
    const maximo = Number(dificuldade.value);

    if (!valor || valor < 1 || valor > maximo) {
        mensagem.className = "";
        mensagem.textContent = `Digite um número entre 1 e ${maximo}.`;
        return;
    }

    tentativas++;
    pontuacao = Math.max(10, pontuacao - 5);

    tentativasTexto.textContent = tentativas;
    pontuacaoTexto.textContent = pontuacao;

    if (valor === numeroSecreto) {
        const pontosFinais = pontuacao + Math.max(0, 50 - tentativas * 5);

        pontuacao = pontosFinais;
        pontuacaoPendente = pontosFinais;

        mensagem.className = "acertou";
        mensagem.textContent = `ACERTOU! O número era ${numeroSecreto}!`;

        pontuacaoTexto.textContent = pontuacao;

        jogoAtivo = false;

        if (pontuacao > recorde) {
            recorde = pontuacao;
            recordeTexto.textContent = recorde;
            localStorage.setItem("recorde", recorde);
        }

        nomeJogador.value = "";
        nomeArea.classList.add("visivel");
        nomeJogador.focus();
    } else if (valor < numeroSecreto) {
        mensagem.className = "baixo";
        mensagem.textContent = "Muito baixo! Tente um número maior.";
    } else {
        mensagem.className = "alto";
        mensagem.textContent = "Muito alto! Tente um número menor.";
    }

    palpite.value = "";
}

function salvarResultado() {
    const nome = nomeJogador.value.trim();

    if (!nome) {
        nomeJogador.focus();
        return;
    }

    ranking.push({
        nome: nome,
        pontos: pontuacaoPendente
    });

    ranking.sort((a, b) => b.pontos - a.pontos);
    ranking = ranking.slice(0, 5);

    localStorage.setItem("ranking", JSON.stringify(ranking));

    atualizarRanking();

    nomeArea.classList.remove("visivel");
}

function atualizarRanking() {
    if (ranking.length === 0) {
        listaRanking.innerHTML = "<p>Nenhuma partida vencida ainda.</p>";
        return;
    }

    const medalhas = ["🥇", "🥈", "🥉"];

    listaRanking.innerHTML = ranking.map((jogador, indice) => {
        const posicao = medalhas[indice] || `${indice + 1}º`;

        return `
            <p>
                <strong>${posicao}</strong>
                ${jogador.nome}
                — ${jogador.pontos} pontos
            </p>
        `;
    }).join("");
}

adivinhar.addEventListener("click", fazerPalpite);

novoJogo.addEventListener("click", iniciarJogo);

salvarNome.addEventListener("click", salvarResultado);

palpite.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        fazerPalpite();
    }
});

nomeJogador.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        salvarResultado();
    }
});

dificuldade.addEventListener("change", iniciarJogo);

atualizarRanking();
iniciarJogo();