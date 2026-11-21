// ===== FERRAMENTAS =====
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== ELEMENTOS DA PÁGINA =====
const telaLigar = document.getElementById("tela-ligar");
const telaBios = document.getElementById("tela-bios");
const botaoLigar = document.getElementById("botao-ligar");
const biosTexto = document.getElementById("bios-texto");
const somInicio = document.getElementById("som-inicio");
somInicio.volume = 0.3;
const telaPreta = document.getElementById("tela-preta");
const telaSplash = document.getElementById("tela-splash");
const areaDeTrabalho = document.querySelector(".area-de-trabalho");
const barraDeTarefas = document.querySelector(".barra-de-tarefas");

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

// ===== A SEQUÊNCIA DE INICIALIZAÇÃO =====
async function iniciar() {
    // troca a tela de ligar pela BIOS
    telaLigar.classList.add("oculta");
    telaBios.classList.remove("oculta");
    await esperar(1000);

    // parte 1: as linhas de antes da memória
    for (const linha of linhasAntes) {
        biosTexto.textContent += linha + "\n";
        const pausa = Math.random() * (1000 - 300) + 300;
        await esperar(pausa);
    }

    // parte 3: o teste de memória
    const textoAntes = biosTexto.textContent;

    for (let memoria = 1024; memoria <= 16384; memoria += 1024) {
        biosTexto.textContent = textoAntes + "Memory Test: " + memoria + "K";
        await esperar(60);
    }

    biosTexto.textContent = textoAntes + "Memory Test: 16384K OK\n";
    await esperar(500);

    // parte 4: as linhas de depois da memória
    for (const linha of linhasDepois) {
        biosTexto.textContent += linha + "\n";
        const pausa = Math.random() * (1000 - 300) + 300;
        await esperar(pausa);
    }

     // 5. troca a BIOS pela tela preta
    telaBios.classList.add("oculta");
    telaPreta.classList.remove("oculta");
    await esperar(2000);

    // 6. troca a tela preta pela tela de carregamento
    telaPreta.classList.add("oculta");
    telaSplash.classList.remove("oculta");
    await esperar(5000);

    // 7. tira a tela de carregamento: fica só o fundo, com a ampulheta
    telaSplash.classList.add("oculta");
    document.body.classList.add("carregando");
    await esperar(2000);

     // 8. aparecem os ícones e a barra, o cursor volta ao normal e toca o som
    areaDeTrabalho.classList.remove("oculta");
    barraDeTarefas.classList.remove("oculta");
    document.body.classList.remove("carregando");
    somInicio.play().catch(() => {
        console.log("Não foi possível tocar o som de início.");
    });

}

// ===== QUANDO CLICAR EM LIGAR =====
botaoLigar.addEventListener("click", () => {
    iniciar();
});