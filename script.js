let palavraSecreta = "";
let tentativas = 0;
let letrasPermitidas = /^[a-zA-Z]+$/;
const MAX_TENTATIVAS = 7;

function iniciarJogo() {
    console.log("Iniciando o jogo");
    const numLetras = document.getElementById("letras").value;
    if (numLetras >= 3 && numLetras <= 7) {
        palavraSecreta = gerarPalavra(numLetras);
        exibirPalavraOculta();
        criarCaixas(numLetras);
        resetarJogo();
        // Definir o número de tentativas
        MAX_TENTATIVAS = 7;
    } else {
        alert("Por favor, escolha um número de letras entre 3 e 7.");
    }
}
const palavrasPorComprimento = {
    3: ["sol", "lua", "mar"],
    4: ["casa", "papel", "água"],
    5: ["fogão", "livro"],
    7: ["teclado", "guitarra"]
    // Adicione mais palavras conforme necessário
};

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
    inputElement.value = inputElement.value.replace(/[^a-zA-Z]/g, "").toLowerCase();
}

function verificarPalavra() {
    const caixas = document.getElementsByClassName("caixa-letra");
    const resultadoElement = document.getElementById("resultado");

    let tentativa = "";
    for (let i = 0; i < caixas.length; i++) {
        tentativa += caixas[i].value;
    }

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

    exibirPalavraOculta();

    if (acertos === palavraSecreta.length) {
        resultadoElement.textContent = `Parabéns! Você acertou a palavra em ${tentativas} tentativas.`;
    } else {
        resultadoElement.textContent = `Tentativa ${tentativas}: ${resultado}`;
    }

   
}