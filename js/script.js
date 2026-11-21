// ===== FERRAMENTAS =====
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== INTERRUPTORES =====
let somLigado = true;   // o botão de volume liga e desliga
let pulou = false;      // vira true quando a pessoa aperta Esc

// ===== ELEMENTOS DA PÁGINA =====
const telaLigar = document.getElementById("tela-ligar");
const telaBios = document.getElementById("tela-bios");
const telaPreta = document.getElementById("tela-preta");
const telaSplash = document.getElementById("tela-splash");
const botaoLigar = document.getElementById("botao-ligar");
const botaoVolume = document.getElementById("botao-volume");
const biosTexto = document.getElementById("bios-texto");
const areaDeTrabalho = document.querySelector(".area-de-trabalho");
const barraDeTarefas = document.querySelector(".barra-de-tarefas");
const somInicio = document.getElementById("som-inicio");
const somClique = document.getElementById("som-clique");
somInicio.volume = 0.3;

// ===== TEXTOS DA BIOS =====
const linhasAntes = [
    "Award Modular BIOS v4.51PG, An Energy Star Ally",
    "Copyright (C) 1984-95, Award Software, Inc.",
    "",
    "PENTIUM-S CPU at 133MHz",
    ""
];

const linhasDepois = [
    "",
    "Detecting IDE Primary Master ... ANDRE-HD 1.2GB",
    "Detecting IDE Primary Slave  ... None",
    "Detecting Portfolio          ... André Luiz OK",
    "",
    "Starting Windows 95..."
];

// ===== TOCAR O SOM DE INÍCIO (só se o som estiver ligado) =====
// NOVO: uma função só, usada no fim da sequência e no Esc
function tocarSomInicio() {
    if (!somLigado) return;
    somInicio.play().catch(() => {
        console.log("Não foi possível tocar o som de início.");
    });
}

// ===== MOSTRAR A ÁREA DE TRABALHO =====
// NOVO: esconde todas as telas de boot e mostra os ícones e a barra
function terminarInicializacao() {
    const telas = document.querySelectorAll(".tela-boot");
    for (const tela of telas) {
        tela.classList.add("oculta");
    }
    areaDeTrabalho.classList.remove("oculta");
    barraDeTarefas.classList.remove("oculta");
    document.body.classList.remove("carregando");
}

// ===== A SEQUÊNCIA DE INICIALIZAÇÃO =====
async function iniciar() {
    // 1. troca a tela de ligar pela BIOS
    telaLigar.classList.add("oculta");
    telaBios.classList.remove("oculta");
    await esperar(1000);
    if (pulou) return;   // NOVO

    // 2. as linhas de antes da memória
    for (const linha of linhasAntes) {
        biosTexto.textContent += linha + "\n";
        const pausa = Math.random() * (1000 - 300) + 300;
        await esperar(pausa);
        if (pulou) return;   // NOVO
    }

    // 3. o teste de memória
    const textoAntes = biosTexto.textContent;

    for (let memoria = 1024; memoria <= 16384; memoria += 1024) {
        biosTexto.textContent = textoAntes + "Memory Test: " + memoria + "K";
        await esperar(60);
        if (pulou) return;   // NOVO
    }

    biosTexto.textContent = textoAntes + "Memory Test: 16384K OK\n";
    await esperar(500);
    if (pulou) return;   // NOVO

    // 4. as linhas de depois da memória
    for (const linha of linhasDepois) {
        biosTexto.textContent += linha + "\n";
        const pausa = Math.random() * (1000 - 300) + 300;
        await esperar(pausa);
        if (pulou) return;   // NOVO
    }

    // 5. troca a BIOS pela tela preta
    telaBios.classList.add("oculta");
    telaPreta.classList.remove("oculta");
    await esperar(2000);
    if (pulou) return;   // NOVO

    // 6. troca a tela preta pela tela de carregamento
    telaPreta.classList.add("oculta");
    telaSplash.classList.remove("oculta");
    await esperar(5000);
    if (pulou) return;   // NOVO

    // 7. tira a tela de carregamento: fica só o fundo, com a ampulheta
    telaSplash.classList.add("oculta");
    document.body.classList.add("carregando");
    await esperar(2000);
    if (pulou) return;   // NOVO

    // 8. aparecem os ícones e a barra, e toca o som
    terminarInicializacao();   // NOVO: reaproveita a função
    tocarSomInicio();          // NOVO: só toca se o som estiver ligado
}

// ===== QUANDO CLICAR EM LIGAR =====
botaoLigar.addEventListener("click", () => {
    iniciar();
});

// ===== QUANDO APERTAR ESC =====
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !pulou) {   // NOVO: "&& !pulou" evita pular duas vezes
        pulou = true;
        terminarInicializacao();
        tocarSomInicio();
    }
});

// ===== QUANDO CLICAR EM QUALQUER BOTÃO =====
document.addEventListener("pointerdown", (evento) => {
    const botao = evento.target.closest("button");
    if (!botao) return;
    if (!somLigado) return;
    somClique.currentTime = 0;
    somClique.play().catch(() => {});
});

// ===== QUANDO CLICAR NO VOLUME =====
botaoVolume.addEventListener("click", () => {
    somLigado = !somLigado;
    console.log("som ligado?", somLigado);
});