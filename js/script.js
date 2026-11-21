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
const janelaBoasVindas = document.getElementById("janela-boas-vindas");
const areaDeTrabalho = document.querySelector(".area-de-trabalho");
const textoDica = document.getElementById("bv-texto-dica");
const botaoProximaDica = document.getElementById("bv-proxima-dica");
const caixaMostrar = document.getElementById("bv-mostrar");
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

const dicas = [
    "Bem-vindo ao meu portfólio!",
    "Clique duas vezes em Meus Projetos para ver o que eu já desenvolvi.",
    "O Internet Explorer leva a um site secreto dos anos 90.",
    "Quer dizer alguma coisa sobre os projetos ou sobre o portfólio? Abra o Inbox e manda uma mensagem.",
    "Acha os sons de clique irritantes? O botão de volume perto do relógio desliga-os.",
    "Na próxima vez que acessar meu site, pressione Esc e pule a inicialização completamente."
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
    if (caixaMostrar.checked) {
    abrirJanela(janelaBoasVindas);
    }
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

// ===== QUANDO CLICAR EM UM BOTÃO DE FECHAR =====
document.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".botao-fechar");
    if (!botao) return;

    const janela = botao.closest(".janela");
    fecharJanela(janela);
});

// ===== QUANDO CLICAR EM UMA JANELA =====

document.addEventListener("pointerdown", (evento) => {
    const janela = evento.target.closest(".janela");
    if (!janela) return;

    ativarJanela(janela);
});



// ===== QUANDO ABRIR UMA JANELA =====
function abrirJanela(janela) {
    janela.classList.remove("oculta");
    if (!acharBotaoTarefa(janela)) {
        criarBotaoTarefa(janela);
    }
    ativarJanela(janela);
}

// ===== QUANDO FECHAR UMA JANELA =====
function fecharJanela(janela) {
    janela.classList.add("oculta");
    const botao = acharBotaoTarefa(janela);
    if (botao) {
        botao.remove();
    }
}

// ===== Sessão de dicas sendo mostradas na janela de boas-vindas =====
let indiceDica = Math.floor(Math.random() * dicas.length);

function mostrarDica() {
    textoDica.textContent = dicas[indiceDica];
}

botaoProximaDica.addEventListener("click", () => {
    indiceDica = (indiceDica + 1) % dicas.length;
    mostrarDica();
});
mostrarDica();
caixaMostrar.addEventListener("change", () => {
    try {
        localStorage.setItem("mostrar-boas-vindas", caixaMostrar.checked ? "sim" : "nao");
    } catch {}
});

try {
    if (localStorage.getItem("mostrar-boas-vindas") === "nao") {
        caixaMostrar.checked = false;
    }
} catch {}


// ===== ARRASTAR JANELAS =====
let janelaArrastada = null;   // a janela que está sendo segurada
let difX = 0;                 // onde, dentro da janela, o mouse pegou
let difY = 0;

document.addEventListener("pointerdown", (evento) => {
    const barra = evento.target.closest(".barra-titulo");
    if (!barra) return;
    if (evento.target.closest("button")) return;   // o ✕ não arrasta

    const janela = barra.closest(".janela");                // 1. acha a janela
    if (janela.classList.contains("maximizada")) return;             // 2. maximizada? não arrasta
    janelaArrastada = janela;                               // 3. senão, começa a arrastar
    janela.classList.add("arrastada");
    
    const posicao = janelaArrastada.getBoundingClientRect();
    difX = evento.clientX - posicao.left;
    difY = evento.clientY - posicao.top;
    
});

document.addEventListener("pointermove", (evento) => {
    if (!janelaArrastada) return;
    janelaArrastada.style.left = (Math.max(0, evento.clientX - difX)) + "px";
    janelaArrastada.style.top = (Math.max(0, evento.clientY - difY)) + "px";
});

document.addEventListener("pointerup", () => {
    janelaArrastada = null;
});


// ===== QUANDO DER DOIS CLIQUES EM UM ÍCONE =====
document.addEventListener("dblclick", (evento) => {
    const icone = evento.target.closest(".icone");
    if(!icone) return;
    
    const nome = icone.dataset.janela;
    const janela = document.getElementById("janela-" + nome);
    if (!janela) return; // icone que ainda não tem janela;

    abrirJanela(janela);
});


// ====== TRAZER UMA JANELA PARA A FRENTE ======
let zTopo = 10; // É o mesmo index do inicio que eu tinha colocado, porém, agora é uma variável que vai aumentando a cada clique em uma janela

function ativarJanela(janela){
    
    // todas as ficam com a barra cinza em cima;

    for(const outra of document.querySelectorAll(".janela")){
        outra.classList.add("inativa");
    }

    // A que está sendo clicada fica com a barra azul em cima;
    janela.classList.remove("inativa");

    // Ela também ganha um indice maior que as outras, para ficar na frente;
    zTopo = zTopo + 1;
    janela.style.zIndex = zTopo;

    // botões da barra: todos soltos...
    for (const outro of document.querySelectorAll(".botao-tarefa")) {
        outro.classList.remove("ativo");
    }
    // ...menos o desta janela
    acharBotaoTarefa(janela).classList.add("ativo");
}

// ===== QUANDO MINIMIZAR UMA JANELA =====
function minimizarJanela(janela) {
    // 1. a janela some (mesma classe do fechar)
    janela.classList.add("oculta");
    // 2. a janela fica inativa (barra cinza)
    janela.classList.add("inativa");
    // 3. o botão dela na barra perde o "ativo" (fica solto, mas NÃO é apagado)
    acharBotaoTarefa(janela).classList.remove("ativo");
}

function maximizarJanela(janela) {
    janela.classList.toggle("maximizada");
}
// ===== BOTÕES DA BARRA DE TAREFAS =====
const janelasAbertas = document.querySelector(".janelas-abertas");

function criarBotaoTarefa(janela){
    const botao = document.createElement("button");  // cria o botao
    botao.type = "button";
    botao.className = "botao-tarefa";
    botao.dataset.janela = janela.id;
    botao.textContent = janela.querySelector(".titulo").textContent;
    janelasAbertas.appendChild(botao);  // Deixa minimizado na barra de tarefas
}

function acharBotaoTarefa(janela){
    return janelasAbertas.querySelector(`.botao-tarefa[data-janela="${janela.id}"]`);
}  


// ===== QUANDO CLICAR EM UM BOTÃO DA BARRA DE TAREFAS =====
document.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".botao-tarefa");
    if (!botao) return;

    const janela = document.getElementById(botao.dataset.janela);

    if (janela.classList.contains("oculta")) {
        // minimizada → volta
        abrirJanela(janela);
    } else if (janela.classList.contains("inativa")) {
        // aberta, mas atrás de outra → vem para a frente
        ativarJanela(janela);
    } else {
        // aberta e na frente → minimiza
        minimizarJanela(janela);
    }
});

// ===== QUANDO CLICAR EM UM BOTÃO DE MINIMIZAR =====
document.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".botao-minimizar");
    if (!botao) return;

    const janela = botao.closest(".janela");
    minimizarJanela(janela);
});

// ===== QUANDO CLICAR EM UM BOTÃO DE MAXIMIZAR =====
document.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".botao-maximizar");
    if (!botao) return;

    const janela = botao.closest(".janela");
    maximizarJanela(janela);
});

