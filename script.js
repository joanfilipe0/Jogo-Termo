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

function focarProximaCaixa() {
    const caixasArray = Array.from(document.getElementsByClassName("caixa-letra"));
    const numColunas = document.getElementById("letras").value;

    // Encontrar a primeira caixa disponível na próxima linha
    for (let i = numColunas; i < caixasArray.length; i++) {
        const caixa = caixasArray[i];
        if (!caixa.closest(".linha-bloqueada") && caixa.value.trim() === '') {
            caixa.focus();
            break;  // Termina o loop após focar na primeira caixa disponível
        }
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
    let enterPress = false; // Adicione uma variável para controlar se o Enter foi pressionado

    caixas.forEach((caixa, index, caixasArray) => {
        caixa.addEventListener('input', (event) => {
            const valorAtual = event.target.value;
            const elementoAtual = event.target;

            // Se o valor atual não for vazio, mova o foco para a próxima caixa
            if (valorAtual !== '' && valorAtual !== ' ') {
                const proximaCaixa = encontrarProximaCaixa(elementoAtual);

                if (proximaCaixa) {
                    proximaCaixa.focus();
                }
            }
        });

        // Adicionar event listener para verificar a palavra ao pressionar Enter
        document.addEventListener("keydown", function (event) {

            const valorAtual = event.target.value;
            const elementoAtual = event.target;

            // Encontre a posição da caixa atual no array caixasArray
            const indexAtual = Array.from(caixasArray).indexOf(elementoAtual);

            if (event.key === "Enter" && !enterPress) {
                verificarPalavra()
                enterPress = true; // Marque que o Enter foi pressionado
                // Definir um atraso de 1000 milissegundos (1 segundo) antes de redefinir enterPress
                setTimeout(function () {
                    enterPress = false;
                }, 100);
            }

            // Se a tecla for 'Backspace' e a caixa estiver vazia, mova o foco para a caixa anterior
            if (event.key === 'Backspace' && valorAtual === '') {
                // Calcule o índice da caixa anterior
                const caixaAnteriorIndex = indexAtual - 1;
                // Vwrifique se o índice calculado é válido
                const caixaAnterior = caixasArray[caixaAnteriorIndex];
                if (caixaAnterior && caixaAnterior.closest(".linha-disponivel")) {
                     // Previna o comportamento padrão para evitar a exclusão do conteúdo da caixa
                    event.preventDefault();
                    caixaAnterior.focus();
                }
            }

            if (event.key === "Tab") {
                // Obtenha todas as caixas como um array-like object
                const caixasArray = document.getElementsByClassName("caixa-letra");
        
                // Obtenha o elemento atualmente focado
                const elementoAtual = document.activeElement;
        
                // Encontre a posição da caixa atual no array-like object caixasArray
                const indexAtual = Array.from(caixasArray).indexOf(elementoAtual);
        
                // Calcule o índice da próxima caixa
                const proximaCaixaIndex = indexAtual + 1;
        
                // Verifique se o índice calculado é válido
                const proximaCaixa = caixasArray[proximaCaixaIndex];
        
                // Verifique se a próxima caixa está bloqueada
                if (proximaCaixa && proximaCaixa.closest(".linha-bloqueada")) {
                    // Impede o foco na próxima caixa se ela estiver bloqueada
                    event.preventDefault();
                }
            }

        });

    });
}

function encontrarProximaCaixa(caixaAtual) {
    const caixasArray = Array.from(document.getElementsByClassName("caixa-letra"));
    const index = caixasArray.indexOf(caixaAtual);

    // Encontra a próxima caixa disponível
    for (let i = index + 1; i < caixasArray.length; i++) {
        const caixa = caixasArray[i];
        if (!caixa.closest(".linha-bloqueada") && caixa.value.trim() === '') {
            return caixa;
        }
    }

    return null; // Retorna null se não houver próxima caixa disponível
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
        focarProximaCaixa();
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

// Função para mostrar o pop-up de Ajuda
function mostrarPopup() {
    document.getElementById("popup").style.display = "block";
}

// Função para fechar o pop-up
function fecharPopup() {
    document.getElementById("popup").style.display = "none";
}
