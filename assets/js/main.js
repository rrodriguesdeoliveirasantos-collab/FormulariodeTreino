// assets/js/main.js
import { bibliotecaExercicios } from './biblioteca-exercicios.js';
import { adicionarDia, limparFormulario, mostrarTela, atualizarNumeroDias } from './modules/ui.js';
import {
     salvarDados, carregarDados, salvarFicha, listarAlunos,
     removerAluno, verFicha, removerFicha, abrirFichaAluno, voltarParaAlunos

} from './modules/storage.js';
import { gerarFicha, gerarPDF } from './modules/pdf.js';
import { setupPWA, setupSplash } from './modules/pwa.js';

// Tornar funções globais para uso no HTML
window.adicionarDia = adicionarDia;
window.limparFormulario = limparFormulario;
window.mostrarTela = mostrarTela;
window.atualizarNumeroDias = atualizarNumeroDias;
window.salvarFicha = salvarFicha;
window.listarAlunos = listarAlunos;
window.removerAluno = removerAluno;
window.verFicha = verFicha;
window.removerFicha = removerFicha;
window.abrirFichaAluno = abrirFichaAluno;
window.gerarFicha = gerarFicha;
window.gerarPDF = gerarPDF;
window.voltarParaAlunos = voltarParaAlunos;

// ... (seus imports e atribuições window.funcao = funcao) ...

// ++++++++++ LINHA NOVA PARA TESTE ++++++++++
// Força a tela de alunos a aparecer assim que o script é executado
document.addEventListener("DOMContentLoaded", function() {
    // Tenta mostrar a tela de alunos e listar os alunos
    if (typeof window.mostrarTela === 'function') {
        window.mostrarTela('tela-alunos');
    }
    if (typeof window.listarAlunos === 'function') {
        window.listarAlunos();
    }
});

// ... (seu event listener original do DOMContentLoaded) ...

// Configurar eventos quando o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
     carregarDados();
     listarAlunos();

     // Event listeners
     document.getElementById("buscarAluno").addEventListener("input", listarAlunos);
     document.getElementById("novaFicha").addEventListener("click", () => {
          limparFormulario();
          mostrarTela("tela-editor");
     });

     document.getElementById("voltarLista").addEventListener("click", () => {
          mostrarTela("tela-alunos");
          listarAlunos();
     });

     document.getElementById("voltarEditor").addEventListener("click", () => {
          mostrarTela("tela-editor");
     });

     const voltarBtn = document.getElementById("voltarParaAlunos");
    if (voltarBtn) {
        // Remove qualquer evento anterior e adiciona novo
        voltarBtn.replaceWith(voltarBtn.cloneNode(true)); // Isso remove eventos antigos
        const novoBotao = document.getElementById("voltarParaAlunos");
        novoBotao.addEventListener("click", function() {
            console.log("Botão voltar clicado!");
            voltarParaAlunos();
        })
     }

     document.getElementById("adicionarDia").addEventListener("click", adicionarDia);
     document.getElementById("gerarPDF").addEventListener("click", gerarPDF);
     document.getElementById("salvarFicha").addEventListener("click", salvarFicha);
     document.getElementById("nome").addEventListener("input", salvarDados);
     document.getElementById("objetivo").addEventListener("input", salvarDados);

     // PWA
     setupPWA();
     setupSplash();
});