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

    // parte 2: o teste de memória
    const textoAntes = biosTexto.textContent;

    for (let memoria = 1024; memoria <= 16384; memoria += 1024) {
        biosTexto.textContent = textoAntes + "Memory Test: " + memoria + "K";
        await esperar(60);
    }

    biosTexto.textContent = textoAntes + "Memory Test: 16384K OK\n";
    await esperar(500);

    // parte 3: as linhas de depois da memória
    for (const linha of linhasDepois) {
        biosTexto.textContent += linha + "\n";
        const pausa = Math.random() * (1000 - 300) + 300;
        await esperar(pausa);
    }

    // o som (no passo 6 ele vai para o fim da sequência)
    somInicio.play().catch(() => {
        console.log("Não foi possível tocar o som de início.");
    });
}

// ===== QUANDO CLICAR EM LIGAR =====
botaoLigar.addEventListener("click", () => {
    iniciar();
});