// assets/js/modules/ui.js
import { bibliotecaExercicios } from '../FormulariodeTREINO/biblioteca-exercicios.js';

let contadorDiasUI = 0;

// === FUNÇÕES PRINCIPAIS (EXPORTADAS) ===

export function adicionarDia() {
    console.log("Adicionando dia...");

    if (contadorDiasUI >= 6) {
        alert("Máximo de 6 dias de treino");
        return;
    }

    contadorDiasUI++;

    const container = document.getElementById("dias-container");

    const bloco = document.createElement("div");
    bloco.className = "dia";

    bloco.innerHTML = `
        <h3>Dia ${contadorDiasUI}</h3>
        <input class="titulo-dia" placeholder="Ex: Inferiores + Cardio">
        <select class="select-grupo">
            <option value=""> Grupo muscular </option>
        </select>
        <select class="select-exercicio">
            <option value="">Adicionar exercício</option>
        </select>
        <div class="lista-exercicios"></div>
        <input class="observacao" placeholder="Observação (opcional)">
        <button type="button" class="remover-dia">Remover dia</button>
    `;

    container.appendChild(bloco);
    configurarSelects(bloco);
    configurarRemocaoDia(bloco);
}

// FUNÇÃO QUE ESTAVA FALTANDO
export function atualizarNumeroDias() {
    const dias = document.querySelectorAll(".dia");
    dias.forEach((dia, index) => {
        const titulo = dia.querySelector("h3");
        titulo.textContent = `Dia ${index + 1}`;
    });
    contadorDiasUI = dias.length;
}

// FUNÇÃO QUE ESTAVA FALTANDO
export function limparFormulario() {
    document.getElementById("nome").value = "";
    document.getElementById("objetivo").value = "";
    document.getElementById("dias-container").innerHTML = "";
    document.getElementById("ficha").innerHTML = "";
    contadorDiasUI = 0;
}

// FUNÇÃO QUE ESTAVA FALTANDO
export function mostrarTela(id) {
    const telas = ["tela-alunos", "tela-editor", "tela-visualizar"];
    telas.forEach(tela => {
        document.getElementById(tela).style.display = "none";
    });
    document.getElementById(id).style.display = "block";
}

// === FUNÇÕES INTERNAS (NÃO EXPORTADAS) ===

function configurarSelects(bloco) {
    const selectGrupo = bloco.querySelector(".select-grupo");
    const selectExercicio = bloco.querySelector(".select-exercicio");
    selectExercicio.style.display = "none";

    // Preenche grupos musculares
    for (const grupo in bibliotecaExercicios) {
        const option = document.createElement("option");
        option.value = grupo;
        option.textContent = grupo;
        selectGrupo.appendChild(option);
    }

    // Evento de mudança do grupo
    selectGrupo.addEventListener("change", function() {
        const grupoSelecionado = this.value;
        selectExercicio.innerHTML = `<option value="">Adicionar exercicio</option>`;

        if (!grupoSelecionado) return;

        bibliotecaExercicios[grupoSelecionado].forEach(ex => {
            const option = document.createElement("option");
            option.value = ex;
            option.textContent = ex;
            selectExercicio.appendChild(option);
        });
        
        selectExercicio.style.display = "block";
    });

    // Evento para adicionar exercício
    selectExercicio.addEventListener("change", function() {
        if (!this.value) return;

        const lista = bloco.querySelector(".lista-exercicios");
        const exercicio = document.createElement("div");
        exercicio.className = "exercicio-item";

        exercicio.innerHTML = `
            <span class="nome-exercicio">${this.value}</span>
            <input class="series" placeholder="Séries">
            <input class="reps" placeholder="Reps">
            <button type="button" class="remover-exercicio">❌</button>
        `;

        lista.appendChild(exercicio);

        exercicio.querySelector(".remover-exercicio")
            .addEventListener("click", () => exercicio.remove());

        this.value = "";
    });
}

function configurarRemocaoDia(bloco) {
    const botaoRemover = bloco.querySelector(".remover-dia");
    botaoRemover.addEventListener("click", function() {
        const confirmar = confirm("Tem certeza que deseja remover este dia?");
        if (confirmar) {
            bloco.remove();
            atualizarNumeroDias(); // Chama a função exportada
        }
    });
}