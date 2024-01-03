let palavraSecreta = "";
let tentativas = 0;
let letrasPermitidas = /^[a-zA-Z]+$/;
const MAX_TENTATIVAS = 7;

function iniciarJogo() {
    console.log("Iniciando o jogo");
    const numLetras = document.getElementById("letras").value;
    if (numLetras >= 3 && numLetras <= 7) {
        palavraSecreta = gerarPalavra(numLetras);
        resetarJogo();
        criarCaixas(numLetras);
        focarPrimeiraCaixa();
    } else {
        alert("Por favor, escolha um número de letras entre 3 e 7.");
    }
}

function focarPrimeiraCaixa() {
    const primeiraCaixa = document.querySelector(".linha-disponivel .caixa-letra");
    if (primeiraCaixa) {
        primeiraCaixa.focus();
    }
}
const palavrasPorComprimento = {
    3: ["sol", "lua", "mar", "sol", "som", "luz", "cor", "paz", "fim", "sal"],
    4: ["casa", "mala", "fala", "pato", "cama", "roda", "vira", "fogo", "ruim", "alto"],
    5: ["fogao", "livro", "fundo", "bola", "lente", "vazio", "comer", "forca", "garfo", "abrao"],
    6: ["liquor", "cifose", "aereo", "ubere", "esofago", "proton", "histan", "ibero", "impeto", "quorum"],
    7: ["teclado", "guitarra", "telefone", "quintal", "agulha", "parafus", "chaveir", "ventila", "abridor", "pratele"]
    // Adicione mais palavras conforme necessário
};

function configurarEntradaAutomatica() {
    const caixas = document.querySelectorAll('.caixa-letra');

    caixas.forEach((caixa, index, caixasArray) => {
        caixa.addEventListener('input', (event) => {
            const valorAtual = event.target.value;

            // Se o valor atual não for vazio, mova o foco para a próxima caixa
            if (valorAtual !== '' && valorAtual !== ' ') {
                const proximaCaixa = caixasArray[index + 1];
                if (proximaCaixa && !proximaCaixa.closest(".linha-bloqueada")) {
                    proximaCaixa.focus();
                }
            }
        });

        // Adicione um ouvinte de tecla pressionada para voltar à caixa anterior ao apagar
        caixa.addEventListener('keyup', (event) => {
            const valorAtual = event.target.value;

            // Se o valor atual for vazio, mova o foco para a caixa anterior
            if (valorAtual === '' && event.key === 'Backspace') {
                const caixaAnterior = caixasArray[index - 1];
                if (caixaAnterior && !caixaAnterior.closest(".linha-bloqueada")) {
                    caixaAnterior.focus();
                }
            }
        });

        // Adicionar event listener para verificar a palavra ao pressionar Enter
        document.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                console.log("Aqui");
            }
        });

    });
}

function gerarPalavra(numLetras) {
    const palavrasDisponiveis = palavrasPorComprimento[numLetras];

    if (palavrasDisponiveis && palavrasDisponiveis.length > 0) {
        return palavrasDisponiveis[Math.floor(Math.random() * palavrasDisponiveis.length)];
    } else {
        console.error(`Não foi possível encontrar uma palavra com ${numLetras} letras.`);
        return ""; // Retorna uma string vazia em caso de falha
    }
}

function exibirPalavraOculta() {
    const palavraOcultaElement = document.getElementById("palavraOculta");
    palavraOcultaElement.textContent = palavraSecreta.split("").map(() => "_").join(" ");
}

function criarCaixas(numLetras) {
    const caixasElement = document.getElementById("caixas");
    caixasElement.innerHTML = "";

    for (let i = 0; i < MAX_TENTATIVAS; i++) {
        const linha = document.createElement("div");
        linha.classList.add("linha-caixas");

        for (let j = 0; j < numLetras; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.classList.add("caixa-letra");
            input.id = `caixa${i}${j}`;
            linha.appendChild(input);
        }

        caixasElement.appendChild(linha);
    }
    desbloquearFileiras();
    configurarEntradaAutomatica();
}

function resetarJogo() {
    tentativas = 0;
    document.getElementById("resultado").textContent = "";
    const caixas = document.getElementsByClassName("caixa-letra");
    for (let caixa of caixas) {
        caixa.value = "";
    }
}

function validarEntrada() {
    const inputElement = document.getElementById("tentativa");
    const valorEntrada = inputElement.value.trim(); // Remove espaços no início e no final

    if (!valorEntrada.match(/^[a-zA-Z]+$/)) {
        alert("Por favor, digite apenas letras e sem espaços.");
        // Limpar o valor do input
        inputElement.value = "";
    } else {
        // Atualizar o valor do input removendo espaços no início e no final
        inputElement.value = valorEntrada;
    }
}

function verificarPalavra() {
    const caixas = document.querySelectorAll(".linha-caixas")[tentativas].getElementsByClassName("caixa-letra");
    const resultadoElement = document.getElementById("resultado");

    let tentativa = "";
    for (let i = 0; i < caixas.length; i++) {
        tentativa += caixas[i].value;
    }

    // Verifica se Contém apenas letras
    if (!tentativa.match(letrasPermitidas)) {
        alert("Por favor, digite apenas letras.");
        return;
    }

    tentativas++;

    let acertos = 0;
    let resultado = "";

    for (let i = 0; i < palavraSecreta.length; i++) {
        const letraCorreta = palavraSecreta[i] === tentativa[i];
        resultado += letraCorreta ? tentativa[i] : "_";
        acertos += letraCorreta ? 1 : 0;
    }

    // Colorir as caixas de acordo com a Verificação
    const caixasAtuais = document.querySelectorAll(".linha-caixas")[tentativas - 1].getElementsByClassName("caixa-letra");

    // Verificar se alguma caixa está vazia
    for (let i = 0; i < caixasAtuais.length; i++) {
        if (caixasAtuais[i].value.trim() === "") {
            tentativas--;
            alert("Por favor, preencha todas as caixas.");
            return;
        }
    }

    for (let x = 0; x < caixasAtuais.length; x++) {
        const letraAtual = caixasAtuais[x].value;
        const letraCorreta = palavraSecreta[x] === letraAtual;

        if (letraCorreta) {
            // Se a letra está correta na posição
            caixasAtuais[x].classList.add("caixa-correta");
        } else {
            // Se a letra está incorreta ou na posição errada
            caixasAtuais[x].classList.add("caixa-incorreta");

            if (palavraSecreta.includes(letraAtual)) {
                // Se a letra está na palavra, mas na posição errada
                caixasAtuais[x].classList.add("letra-na-posicao-errada");
            }
        }
    }

    if (acertos === palavraSecreta.length) {
        resultadoElement.textContent = `Parabéns! Você acertou a palavra em ${tentativas} tentativas.`;
    } else {
        //resultadoElement.textContent = `Tentativa ${tentativas}: ${resultado}`;
        desbloquearFileiras();
        if (tentativas === MAX_TENTATIVAS) {
            resultadoElement.textContent = "Você perdeu! Tente novamente.";
            // Adicione outras ações que desejar após o jogo ser perdido
        }
    }



}

function desbloquearFileiras() {
    const caixasContainer = document.getElementById("caixas");
    const linhas = caixasContainer.getElementsByClassName("linha-caixas");

    for (let i = 0; i < MAX_TENTATIVAS; i++) {
        const linha = linhas[i];
        if (linha) {
            linha.classList.remove("linha-bloqueada");
            linha.classList.add(i !== tentativas ? "linha-bloqueada" : "linha-disponivel");
        }
    }
}