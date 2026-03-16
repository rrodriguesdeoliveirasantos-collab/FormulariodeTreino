// assets/js/modules/storage.js

// Salvar dados do formulário
export function salvarDados() {
    const nome = document.getElementById("nome").value;
    const objetivo = document.getElementById("objetivo").value;
    localStorage.setItem("nome", nome);
    localStorage.setItem("objetivo", objetivo);
}

// Carregar dados do formulário
export function carregarDados() {
    const nome = localStorage.getItem("nome");
    const objetivo = localStorage.getItem("objetivo");
    if (nome) document.getElementById("nome").value = nome;
    if (objetivo) document.getElementById("objetivo").value = objetivo;
}

// Salvar ficha completa
export function salvarFicha() {
    const nome = document.getElementById("nome").value.trim();
    const objetivo = document.getElementById("objetivo").value.trim();

    if (!nome || !objetivo) {
        alert("Preencha nome e objetivo antes de salvar!");
        return;
    }

    const dias = document.querySelectorAll(".dia");
    if (dias.length === 0) {
        alert("Adicione pelo menos um dia de treino!");
        return;
    }

    let diasTreino = [];
    dias.forEach(dia => {
        const titulo = dia.querySelector(".titulo-dia").value.trim() || "Treino";
        const obs = dia.querySelector(".observacao").value.trim();
        const exerciciosDivs = dia.querySelectorAll(".exercicio-item");

        let exercicios = [];
        exerciciosDivs.forEach(ex => {
            exercicios.push({
                nome: ex.querySelector(".nome-exercicio").textContent,
                series: ex.querySelector(".series").value.trim(),
                reps: ex.querySelector(".reps").value.trim()
            });
        });

        diasTreino.push({ titulo, obs, exercicios });
    });

    const novaFicha = { objetivo, dias: diasTreino };
    let alunos = JSON.parse(localStorage.getItem("Alunos")) || [];
    let aluno = alunos.find(a => a.nome === nome);

    if (!aluno) {
        aluno = { nome, fichas: [] };
        alunos.push(aluno);
    }

    aluno.fichas.push(novaFicha);
    localStorage.setItem("Alunos", JSON.stringify(alunos));
    alert("Ficha salva com sucesso!");
}

// Listar alunos
export function listarAlunos() {
    const alunos = JSON.parse(localStorage.getItem("Alunos")) || [];
    const container = document.getElementById("lista-fichas");
    const busca = document.getElementById("buscarAluno").value.toLowerCase();
    container.innerHTML = "";

    alunos.forEach((aluno, index) => {
        if (!aluno.nome.toLowerCase().includes(busca)) return;

        const div = document.createElement("div");
        div.className = "ficha-salva";
        div.innerHTML = `
            <b>${aluno.nome}</b>
            <button type="button" onclick="window.verFicha(${index})">Ver fichas</button>
            <button type="button" onclick="window.removerAluno(${index})">Excluir</button>
        `;
        container.appendChild(div);
    });
}

// Remover aluno
export function removerAluno(index) {
    if (!confirm("Deseja remover esse aluno?")) return;

    let alunos = JSON.parse(localStorage.getItem("Alunos")) || [];
    alunos.splice(index, 1);
    localStorage.setItem("Alunos", JSON.stringify(alunos));
    listarAlunos();
}

// Ver fichas do aluno
export function verFicha(index) {
    const alunos = JSON.parse(localStorage.getItem("Alunos"));
    const aluno = alunos[index];
    const container = document.getElementById("lista-fichas");
    container.innerHTML = "";

    aluno.fichas.forEach((ficha, idx) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <b>Ficha ${idx + 1}</b> - ${ficha.objetivo}
            <button type="button" onclick="window.abrirFichaAluno(${index}, ${idx})">Abrir</button>
            <button type="button" onclick="window.removerFicha(${index}, ${idx})">Excluir</button>
        `;
        container.appendChild(div);
    });
}

// Remover ficha
export function removerFicha(alunoIndex, fichaIndex) {
    if (!confirm("Deseja excluir essa ficha?")) return;

    let alunos = JSON.parse(localStorage.getItem("Alunos")) || [];
    alunos[alunoIndex].fichas.splice(fichaIndex, 1);
    localStorage.setItem("Alunos", JSON.stringify(alunos));
    verFicha(alunoIndex);
}

// Abrir ficha do aluno
export function abrirFichaAluno(alunoIndex, fichaIndex) {
    const alunos = JSON.parse(localStorage.getItem("Alunos"));
    const ficha = alunos[alunoIndex].fichas[fichaIndex];

    document.getElementById("nome").value = alunos[alunoIndex].nome;
    document.getElementById("objetivo").value = ficha.objetivo;
    document.getElementById("dias-container").innerHTML = "";

    // Reset contador e recriar dias
    window.contadorDiasUI = 0;
    ficha.dias.forEach(dia => {
        window.adicionarDia();
        const dias = document.querySelectorAll(".dia");
        const ultimo = dias[dias.length - 1];

        ultimo.querySelector(".titulo-dia").value = dia.titulo;
        ultimo.querySelector(".observacao").value = dia.obs;

        const lista = ultimo.querySelector(".lista-exercicios");
        if (!dia.exercicios) return;

        dia.exercicios.forEach(ex => {
            const exercicio = document.createElement("div");
            exercicio.className = "exercicio-item";
            exercicio.innerHTML = `
                <span class="nome-exercicio">${ex.nome}</span>
                <input class="series" placeholder="Séries" value="${ex.series}">
                <input class="reps" placeholder="Reps" value="${ex.reps}">
                <button type="button" class="remover-exercicio">❌</button>
            `;
            lista.appendChild(exercicio);

            exercicio.querySelector(".remover-exercicio")
                .addEventListener("click", () => exercicio.remove());
        });
    });

    window.mostrarTela("tela-editor");
}