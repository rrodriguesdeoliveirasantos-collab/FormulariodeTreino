let contadorDias = 0

const bibliotecaExercicios = ["Agachamento",
"Leg Press",
"Cadeira Extensora",
"Cadeira Flexora",
"Elevação Pélvica",
"Afundo",
"Supino",
"Remada",
"Puxada na Frente",
"Elevação Lateral",
"Rosca Bíceps",
"Tríceps Polia",
"Prancha",
"Abdominal"]

function adicionarDia() {

     if (contadorDias >= 6) {
          alert("Máximo de 6 dias de treino")
          return
     }

     contadorDias++

     const container = document.getElementById("dias-container")

     const bloco = document.createElement("div")
     bloco.className = "dia"

     bloco.innerHTML = `
<h3>Dia ${contadorDias}</h3>

<input class="titulo-dia" placeholder="Ex: Inferiores + Cardio">

<select class="select-exercicio">
     <option value="">Adicionar exercício</option>
</select>

<textarea class="exercicios" placeholder="Um exercício por linha"></textarea>

<input class="observacao" placeholder="Observação (opcional)">

<button type="button" class="remover-dia" onclick="removerDia(this)">
 Remover dia</button>
`

     container.appendChild(bloco)


     const select = bloco.querySelector(".select-exercicio")

     bibliotecaExercicios.forEach(exercicio => {
          const option = document.createElement("option")


          option.value = exercicio
          option.textContent = exercicio


          select.appendChild(option)
     })

     select.addEventListener("change", function () {

          if (this.value === "") return

               const textarea = bloco.querySelector(".exercicios")
               textarea.value += this.value + "\n"
               this.value = ""          

     })
     bloco.querySelector(".titulo-dia").addEventListener("input", salvarFicha)
     bloco.querySelector(".exercicios").addEventListener("input", salvarFicha)
     bloco.querySelector(".observacao").addEventListener("input", salvarFicha)


}

function gerarFicha() {

     const nome = document.getElementById("nome").value

     if (nome.trim() === "") {
          alert("Por favor, preencha o nome do aluno")
          return
     }

     const objetivo = document.getElementById("objetivo").value

     if (objetivo.trim() === "") {
          alert("Por favor, preencha o objetivo do aluno")
          return
     }

     const dias = document.querySelectorAll(".dia")

     if (dias.length === 0) {
          alert("Adicione pelo menos um dia de treino")
          return
     }

     let html = `
<h1>Ficha de Treino</h1>
<p><b>Aluno:</b> ${nome}</p>
<p><b>Objetivo:</b> ${objetivo}</p>
`

     dias.forEach((dia, index) => {

          let titulo = dia.querySelector(".titulo-dia").value

          if (titulo.trim() === "") {
               titulo = "Treino"
          }

          const exercicios = dia.querySelector(".exercicios").value
          const obs = dia.querySelector(".observacao").value

          const lista = exercicios.split("\n")
          const filtrados = lista.filter(ex => ex.trim() !== "")
          const itens = filtrados.map(ex => `<li>${ex}</li>`)

          const htmlExercicios = `<ul>${itens.join("")}</ul>`

          html += `
<div class="card">
<h2>Dia ${index + 1} - ${titulo}</h2>
${htmlExercicios}
`

          if (obs.trim() !== "") {
               html += `<p class="obs">${obs}</p>`
          }

          html += `</div>`

     })

     document.getElementById("ficha").innerHTML = html

}

function gerarPDF() {

     const elemento = document.getElementById("ficha")

     html2pdf().from(elemento).save()
}

function attNunDias() {

     const dias = document.querySelectorAll(".dia")
     dias.forEach((dia, index) => {
          const titulo = dia.querySelector("h3")
          titulo.textContent = `Dia ${index + 1}`
     })

     contadorDias = dias.length

}


function removerDia(botao) {

     const confirmar = confirm("Tem certeza que deseja remover este dia?")

     if (confirmar) {
          botao.parentElement.remove()
          attNunDias() // Atualiza os títulos dos dias e o contador
     }

}




function limparFormulario() {
     const confirmar = confirm("Tem certeza que deseja limpar o formulário?")

     if (!confirmar) return

     document.getElementById("nome").value = ""
     document.getElementById("objetivo").value = ""


     document.getElementById("dias-container").innerHTML = ""


     document.getElementById("ficha").innerHTML = ""

     contadorDias = 0


}

function salvarDados() {

     const nome = document.getElementById("nome").value
     const objetivo = document.getElementById("objetivo").value

     localStorage.setItem("nome", nome)
     localStorage.setItem("objetivo", objetivo)

}


document
     .getElementById("nome")
     .addEventListener("input", salvarDados)

document
     .getElementById("objetivo")
     .addEventListener("input", salvarDados)


function carregarDados() {
     const nome = localStorage.getItem("nome")
     const objetivo = localStorage.getItem("objetivo")

     if (nome) {
          document.getElementById("nome").value = nome
     }
     if (objetivo) {
          document.getElementById("objetivo").value = objetivo
     }

}


function salvarFicha() {

     const nome = document.getElementById("nome").value
     const objetivo = document.getElementById("objetivo").value

     const dias = document.querySelectorAll(".dia")

     let diasTreino = []

     dias.forEach(dia => {

          const titulo = dia.querySelector(".titulo-dia").value
          const exercicios = dia.querySelector(".exercicios").value
          const obs = dia.querySelector(".observacao").value

          diasTreino.push({
               titulo: titulo,
               exercicios: exercicios,
               obs: obs
          })

     })

     const ficha = {
          nome: nome,
          objetivo: objetivo,
          dias: diasTreino
     }

     let fichas = JSON.parse(localStorage.getItem("fichas")) || []

     fichas.push(ficha)

     localStorage.setItem("fichas", JSON.stringify(fichas))

     alert("Ficha salva com sucesso!")

     listarFichas()

}


function carregarFicha() {

     const dados = localStorage.getItem("diasTreino")

     if (!dados) return


     const lista = JSON.parse(dados)


     lista.forEach(dia => {


          adicionarDia()

          const dias = document.querySelectorAll(".dia")
          const ultimo = dias[dias.length - 1]


          ultimo.querySelector(".titulo-dia").value = dia.titulo
          ultimo.querySelector(".exercicios").value = dia.exercicios
          ultimo.querySelector(".observacao").value = dia.obs
     })
}


function listarFichas() {

     const fichas = JSON.parse(localStorage.getItem("fichas")) || []

     const container = document.getElementById("lista-fichas")
    
     container.innerHTML = ""

     fichas.forEach((ficha, index) => {
    const div = document.createElement("div")

    div.className = "ficha-salva"
    
    div.innerHTML = `
    <b>${ficha.nome}</b> - ${ficha.objetivo}
    <button type="button" onclick="abrirFicha(${index})">
    Abrir</button>

    <button type="button" onclick="excluirFicha(${index})">
    Excluir</button>

    `

    container.appendChild(div)
 })

}


function abrirFicha(index) {

     const fichas = JSON.parse(localStorage.getItem("fichas"))

     const ficha = fichas[index]

     document.getElementById("nome").value = ficha.nome
     document.getElementById("objetivo").value = ficha.objetivo

     document.getElementById("dias-container").innerHTML = ""

     contadorDias = 0

     ficha.dias.forEach(dia => {
          adicionarDia()
          const dias = document.querySelectorAll(".dia")
          const ultimo = dias[dias.length - 1]

          ultimo.querySelector(".titulo-dia").value = dia.titulo
          ultimo.querySelector(".exercicios").value = dia.exercicios
          ultimo.querySelector(".observacao").value = dia.obs
     })


}


function excluirFicha(index) {

     const confirmar = confirm("Tem certeza que deseja excluir esta ficha?")

     if (!confirmar) return

     let fichas = JSON.parse(localStorage.getItem("fichas")) || []

     fichas.splice(index, 1)

     localStorage.setItem("fichas", JSON.stringify(fichas))

     listarFichas()
}


document.addEventListener("DOMContentLoaded", function () {

     carregarDados()
     listarFichas()

     document
          .getElementById("gerarFicha")
          .addEventListener("click", gerarFicha)

     document
          .getElementById("adicionarDia")
          .addEventListener("click", adicionarDia)

     document
          .getElementById("gerarPDF")
          .addEventListener("click", gerarPDF)


     document
          .getElementById("limparFormulario")
          .addEventListener("click", limparFormulario)

})
document.getElementById("salvarFicha")
.addEventListener("click", salvarFicha)