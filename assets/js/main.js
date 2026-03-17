// assets/js/main.js - VERSÃO CORRIGIDA
import { bibliotecaExercicios } from '/FormulariodeTreino/assets/js/biblioteca-exercicios.js';
import { adicionarDia, limparFormulario, mostrarTela, atualizarNumeroDias } from '/FormulariodeTreino/assets/js/modules/ui.js';
import {
     salvarDados, carregarDados, salvarFicha, listarAlunos,
     removerAluno, verFicha, removerFicha, abrirFichaAluno, voltarParaAlunos
} from '/FormulariodeTreino/assets/js/modules/storage.js';
import { gerarFicha, gerarPDF } from '/FormulariodeTreino/assets/js/modules/pdf.js';
import { setupPWA, setupSplash } from '/FormulariodeTreino/assets/js/modules/pwa.js';

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

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 App iniciando...");
    
    // Mostra a tela de alunos primeiro
    mostrarTela('tela-alunos');
    
    // Carrega dados
    carregarDados();
    listarAlunos();
    
    // Configura eventos
    document.getElementById('buscarAluno')?.addEventListener('input', listarAlunos);
    document.getElementById('novaFicha')?.addEventListener('click', () => {
        limparFormulario();
        mostrarTela('tela-editor');
    });
    
    document.getElementById('voltarLista')?.addEventListener('click', () => {
        mostrarTela('tela-alunos');
        listarAlunos();
    });
    
    document.getElementById('voltarEditor')?.addEventListener('click', () => {
        mostrarTela('tela-editor');
    });
    
    document.getElementById('voltarParaAlunos')?.addEventListener('click', voltarParaAlunos);
    document.getElementById('adicionarDia')?.addEventListener('click', adicionarDia);
    document.getElementById('gerarPDF')?.addEventListener('click', gerarPDF);
    document.getElementById('salvarFicha')?.addEventListener('click', salvarFicha);
    document.getElementById('nome')?.addEventListener('input', salvarDados);
    document.getElementById('objetivo')?.addEventListener('input', salvarDados);
    
    // PWA
    setupPWA();
    setupSplash();
    
    console.log("✅ App pronto!");
});