// assets/js/main.js
import { bibliotecaExercicios } from './biblioteca-exercicios.js';
import { adicionarDia, limparFormulario, mostrarTela, atualizarNumeroDias } from './modules/ui.js';
import {
     salvarDados, carregarDados, salvarFicha, listarAlunos,
     removerAluno, verFicha, removerFicha, abrirFichaAluno, voltarParaAlunos
} from './modules/storage.js';
import { gerarFicha, gerarPDF } from './modules/pdf.js';
import { setupPWA, setupSplash } from './modules/pwa.js';

// === PRIMEIRO: Tornar funções globais ===
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

// === DEPOIS: Configurar eventos (UM ÚNICO EVENT LISTENER) ===
document.addEventListener("DOMContentLoaded", function () {
     console.log("DOM Carregado - Iniciando app...");
     
     // Carrega dados salvos
     carregarDados();
     
     // FORÇA A TELA DE ALUNOS A APARECER
     mostrarTela("tela-alunos");
     
     // Lista os alunos
     listarAlunos();

     // Event listeners
     const buscarInput = document.getElementById("buscarAluno");
     if (buscarInput) {
         buscarInput.addEventListener("input", listarAlunos);
     }

     const novaFichaBtn = document.getElementById("novaFicha");
     if (novaFichaBtn) {
         novaFichaBtn.addEventListener("click", () => {
              limparFormulario();
              mostrarTela("tela-editor");
         });
     }

     const voltarListaBtn = document.getElementById("voltarLista");
     if (voltarListaBtn) {
         voltarListaBtn.addEventListener("click", () => {
              mostrarTela("tela-alunos");
              listarAlunos();
         });
     }

     const voltarEditorBtn = document.getElementById("voltarEditor");
     if (voltarEditorBtn) {
         voltarEditorBtn.addEventListener("click", () => {
              mostrarTela("tela-editor");
         });
     }

     const voltarBtn = document.getElementById("voltarParaAlunos");
     if (voltarBtn) {
         voltarBtn.addEventListener("click", function() {
             console.log("Botão voltar clicado!");
             voltarParaAlunos();
         });
     }

     const adicionarDiaBtn = document.getElementById("adicionarDia");
     if (adicionarDiaBtn) {
         adicionarDiaBtn.addEventListener("click", adicionarDia);
     }

     const gerarPDFBtn = document.getElementById("gerarPDF");
     if (gerarPDFBtn) {
         gerarPDFBtn.addEventListener("click", gerarPDF);
     }

     const salvarFichaBtn = document.getElementById("salvarFicha");
     if (salvarFichaBtn) {
         salvarFichaBtn.addEventListener("click", salvarFicha);
     }

     const nomeInput = document.getElementById("nome");
     if (nomeInput) {
         nomeInput.addEventListener("input", salvarDados);
     }

     const objetivoInput = document.getElementById("objetivo");
     if (objetivoInput) {
         objetivoInput.addEventListener("input", salvarDados);
     }

     // PWA
     setupPWA();
     setupSplash();
     
     console.log("App iniciado com sucesso!");
});