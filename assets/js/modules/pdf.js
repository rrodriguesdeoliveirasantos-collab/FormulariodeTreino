// assets/js/modules/pdf.js

export function gerarFicha() {
    const nome = document.getElementById("nome").value;
    if (nome.trim() === "") {
        alert("Por favor, preencha o nome do aluno");
        return;
    }


    const objetivo = document.getElementById("objetivo").value;
    if (objetivo.trim() === "") {
        alert("Por favor, preencha o objetivo do aluno");
        return;
    }

    const dias = document.querySelectorAll(".dia");
    if (dias.length === 0) {
        alert("Adicione pelo menos um dia de treino");
        return;
    }

    let html = `
        <h1>Ficha de Treino</h1>
        <p><b>Aluno:</b> ${nome}</p>
        <p><b>Objetivo:</b> ${objetivo}</p>
        <p><b>Total de dias:</b> ${dias.length}</p>
    `;

    dias.forEach((dia, index) => {
        let titulo = dia.querySelector(".titulo-dia").value;
        if (titulo.trim() === "") titulo = "Treino";

        const exercicios = dia.querySelectorAll(".exercicio-item");
        const obs = dia.querySelector(".observacao").value || "";

        let itens = [];
        exercicios.forEach(ex => {
            const nomeEx = ex.querySelector(".nome-exercicio").textContent;
            const series = ex.querySelector(".series").value;
            const reps = ex.querySelector(".reps").value;

            let texto = nomeEx;
            if (series || reps) texto += ` - ${series}x${reps}`;
            itens.push(`<li>${texto}</li>`);
        });

        const htmlExercicios = `<ul>${itens.join("")}</ul>`;

        html += `
            <div class="card">
                <h2>Dia ${index + 1} - ${titulo}</h2>
                ${htmlExercicios}
                ${obs ? `<p class="obs">${obs}</p>` : ""}
            </div>
        `;
    });

    document.getElementById("ficha").innerHTML = html;
    window.mostrarTela("tela-visualizar");
}

export function gerarPDF() {
    const elemento = document.getElementById("ficha");
    const opt = {
        margin: 10,
        filename: "ficha-de-treino.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(elemento).save();
}