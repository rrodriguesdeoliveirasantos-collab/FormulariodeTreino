// assets/js/modules/storage.js
let fichaEmEdicao = null;

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

// Salvar ficha
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

    if (fichaEmEdicao !== null) {
        // 🔁 EDITAR ficha existente
        aluno.fichas[fichaEmEdicao] = novaFicha;
    } else {
        // ➕ NOVA ficha
        aluno.fichas.push(novaFicha);
    }

    localStorage.setItem("Alunos", JSON.stringify(alunos));

    fichaEmEdicao = null; // limpa modo edição

    alert("Ficha salva com sucesso!");
}

// Listar alunos

export function listarAlunos() {
    console.log("Listando alunos");
    
    // Garante que os botões estejam no estado correto
    const voltarBtn = document.getElementById("voltarParaAlunos");
    const novaFichaBtn = document.getElementById("novaFicha");
    
    if (voltarBtn) voltarBtn.style.display = "none";
    if (novaFichaBtn) novaFichaBtn.style.display = "inline-block";

    const alunos = JSON.parse(localStorage.getItem("Alunos")) || [];
    const container = document.getElementById("lista-fichas");
    const busca = document.getElementById("buscarAluno").value.toLowerCase();

    container.innerHTML = "";

    if (alunos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum aluno cadastrado.";
        mensagem.style.textAlign = "left";
        mensagem.style.padding = "20px";
        container.appendChild(mensagem);
        return;
    }

    alunos.forEach((aluno, index) => {
        if (!aluno.nome.toLowerCase().includes(busca)) return;

        const div = document.createElement("div");
        div.className = "ficha-salva";
        div.style.marginBottom = "10px";
        div.style.padding = "15px";
        div.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        div.style.borderRadius = "8px";
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <b>${aluno.nome}</b>
                    <br>
                    <small>${aluno.fichas?.length || 0} fichas</small>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary btn-sm" onclick="window.verFicha(${index})">
                        Ver fichas
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.removerAluno(${index})">
                        Excluir
                    </button>
                </div>
            </div>
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
    console.log("Ver fichas do aluno:", index);
    
    // Verifica se o índice é válido
    if (index === undefined || index === null) {
        console.error("Índice do aluno inválido");
        return;
    }

    // Tenta pegar alunos do localStorage
    let alunos;
    try {
        alunos = JSON.parse(localStorage.getItem("Alunos"));
    } catch (e) {
        console.error("Erro ao ler localStorage:", e);
        alunos = [];
    }
    
    // Verifica se alunos é um array e tem o índice
    if (!Array.isArray(alunos) || !alunos[index]) {
        console.error("Aluno não encontrado no índice:", index);
        alert("Erro: Aluno não encontrado!");
        return;
    }

    const aluno = alunos[index];
    
    // Verifica se o aluno tem nome
    if (!aluno || !aluno.nome) {
        console.error("Aluno inválido:", aluno);
        alert("Erro: Dados do aluno inválidos!");
        return;
    }

    const container = document.getElementById("lista-fichas");
    if (!container) {
        console.error("Container lista-fichas não encontrado");
        return;
    }

    // Mostra botão voltar e esconde nova ficha
    const voltarBtn = document.getElementById("voltarParaAlunos");
    const novaFichaBtn = document.getElementById("novaFicha");
    
    if (voltarBtn) voltarBtn.style.display = "inline-block";
    if (novaFichaBtn) novaFichaBtn.style.display = "none";

    // Limpa o container
    container.innerHTML = "";

    // Adiciona cabeçalho com verificação
    try {
        const headerDiv = document.createElement("div");
        headerDiv.style.marginBottom = "20px";
        headerDiv.style.padding = "10px";
        headerDiv.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        headerDiv.style.borderRadius = "8px";
        headerDiv.style.textAlign = "left";
        headerDiv.innerHTML = `<h3>Fichas de ${aluno.nome || "Aluno"}</h3>`;
        container.appendChild(headerDiv);
    } catch (e) {
        console.error("Erro ao criar cabeçalho:", e);
    }

    // Verifica se o aluno tem fichas
    if (!aluno.fichas || !Array.isArray(aluno.fichas) || aluno.fichas.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.style.textAlign = "left";
        mensagem.style.padding = "20px";
        mensagem.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        mensagem.style.borderRadius = "8px";
        mensagem.textContent = "Nenhuma ficha encontrada para este aluno.";
        container.appendChild(mensagem);
        return;
    }

    // Lista as fichas
    aluno.fichas.forEach((ficha, idx) => {
        try {
            const div = document.createElement("div");
            div.className = "ficha-salva";
            div.style.marginBottom = "10px";
            div.style.padding = "15px";
            div.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            div.style.borderRadius = "8px";
            
            const objetivo = ficha.objetivo || "Sem objetivo";
            const totalDias = ficha.dias?.length || 0;
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <b>Ficha ${idx + 1}</b> - ${objetivo}
                        <br>
                        <small>${totalDias} dias de treino</small>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-primary btn-sm" onclick="window.abrirFichaAluno(${index}, ${idx})">
                            Abrir
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="window.removerFicha(${index}, ${idx})">
                            Excluir
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        } catch (e) {
            console.error("Erro ao criar item de ficha:", e);
        }
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

// Abrir ficha do alunos

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

    fichaEmEdicao = fichaIndex;
    
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

// Função para voltar para a lista de alunos
export function voltarParaAlunos() {
    console.log("Voltando para lista de alunos");
    
    // Esconde o botão voltar e mostra o nova ficha
    const voltarBtn = document.getElementById("voltarParaAlunos");
    const novaFichaBtn = document.getElementById("novaFicha");
    
    if (voltarBtn) {
        voltarBtn.style.display = "none";
        console.log("Botão voltar escondido");
    }
    
    if (novaFichaBtn) {
        novaFichaBtn.style.display = "inline-block";  // Mudei para inline-block
        console.log("Botão nova ficha exibido");
    }
    
    // Recarrega a lista de alunos
    if (typeof window.listarAlunos === 'function') {
        window.listarAlunos();
    } else {
        listarAlunos();
    }
}