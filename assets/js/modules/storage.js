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
// assets/js/modules/storage.js

// ... outras funções ...

export function abrirFichaAluno(alunoIndex, fichaIndex) {
    console.log("Abrindo ficha do aluno:", alunoIndex, fichaIndex); // Para debug
    
    // Pega alunos do localStorage
    const alunos = JSON.parse(localStorage.getItem("Alunos"));
    
    // Verificações de segurança
    if (!alunos) {
        console.error("Nenhum aluno encontrado no localStorage");
        alert("Erro ao carregar ficha: dados não encontrados");
        return;
    }
    
    if (!alunos[alunoIndex]) {
        console.error("Aluno não encontrado no índice:", alunoIndex);
        alert("Erro ao carregar ficha: aluno não encontrado");
        return;
    }
    
    const aluno = alunos[alunoIndex];
    
    if (!aluno.fichas || !aluno.fichas[fichaIndex]) {
        console.error("Ficha não encontrada no índice:", fichaIndex);
        alert("Erro ao carregar ficha: ficha não encontrada");
        return;
    }
    
    const ficha = aluno.fichas[fichaIndex];
    
    console.log("Ficha carregada:", ficha); // Para debug

    // Preenche dados básicos
    const nomeInput = document.getElementById("nome");
    const objetivoInput = document.getElementById("objetivo");
    
    if (nomeInput) nomeInput.value = aluno.nome || "";
    if (objetivoInput) objetivoInput.value = ficha.objetivo || "";
    
    // Limpa o container de dias
    const container = document.getElementById("dias-container");
    if (container) {
        container.innerHTML = "";
    } else {
        console.error("Container de dias não encontrado");
        return;
    }
    
    // Reseta o contador global
    if (typeof window.contadorDiasUI !== 'undefined') {
        window.contadorDiasUI = 0;
    }

    // Verifica se existem dias na ficha
    if (!ficha.dias || ficha.dias.length === 0) {
        console.log("Ficha sem dias de treino");
        window.mostrarTela("tela-editor");
        return;
    }

    // Função para aguardar o DOM atualizar
    const aguardarDiaRenderizado = () => {
        return new Promise(resolve => {
            const checkExist = setInterval(() => {
                const dias = document.querySelectorAll(".dia");
                if (dias.length > 0) {
                    clearInterval(checkExist);
                    resolve(dias);
                }
            }, 100); // Verifica a cada 100ms
        });
    };

    // Processa cada dia de forma assíncrona
    const processarDias = async () => {
        for (let i = 0; i < ficha.dias.length; i++) {
            const dia = ficha.dias[i];
            
            // Chama a função para adicionar um novo dia
            if (typeof window.adicionarDia === 'function') {
                window.adicionarDia();
            } else {
                console.error("Função adicionarDia não encontrada");
                return;
            }
            
            // Aguarda o dia ser renderizado
            const dias = await aguardarDiaRenderizado();
            const ultimo = dias[dias.length - 1];
            
            if (!ultimo) {
                console.error("Dia não foi criado corretamente");
                continue;
            }

            // Preenche o título do dia
            const tituloInput = ultimo.querySelector(".titulo-dia");
            if (tituloInput) {
                tituloInput.value = dia.titulo || "Treino";
            }

            // Preenche a observação
            const obsInput = ultimo.querySelector(".observacao");
            if (obsInput) {
                obsInput.value = dia.obs || "";
            }

            // Pega a lista de exercícios
            const lista = ultimo.querySelector(".lista-exercicios");
            if (!lista) {
                console.error("Lista de exercícios não encontrada");
                continue;
            }

            // Verifica se existem exercícios no dia
            if (!dia.exercicios || dia.exercicios.length === 0) {
                continue;
            }

            // Adiciona cada exercício
            dia.exercicios.forEach(ex => {
                if (!ex || !ex.nome) return;

                const exercicio = document.createElement("div");
                exercicio.className = "exercicio-item";
                
                exercicio.innerHTML = `
                    <span class="nome-exercicio">${ex.nome}</span>
                    <input class="series" placeholder="Séries" value="${ex.series || ''}">
                    <input class="reps" placeholder="Reps" value="${ex.reps || ''}">
                    <button type="button" class="remover-exercicio">❌</button>
                `;

                lista.appendChild(exercicio);

                // Adiciona evento para remover o exercício
                const removerBtn = exercicio.querySelector(".remover-exercicio");
                if (removerBtn) {
                    removerBtn.addEventListener("click", () => exercicio.remove());
                }
            });
        }
    };

    // Executa o processamento dos dias
    processarDias().then(() => {
        // Mostra a tela de edição após processar todos os dias
        if (typeof window.mostrarTela === 'function') {
            window.mostrarTela("tela-editor");
        } else {
            console.error("Função mostrarTela não encontrada");
            // Tenta chamar diretamente
            mostrarTela("tela-editor");
        }
    }).catch(error => {
        console.error("Erro ao processar dias:", error);
        alert("Erro ao carregar os dias de treino");
    });


    window.mostrarTela("tela-editor");
}