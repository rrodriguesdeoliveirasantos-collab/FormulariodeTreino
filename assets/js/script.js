let contadorDias = 0

function adicionarDia(){

if(contadorDias >= 6){
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

<textarea class="exercicios" placeholder="Um exercício por linha"></textarea>

<input class="observacao" placeholder="Observação (opcional)">

<button class="remover-dia" onclick="removerDia(this)">❌ Remover dia</button>
`

container.appendChild(bloco)

}

function gerarFicha(){

const nome = document.getElementById("nome").value
const objetivo = document.getElementById("objetivo").value

const dias = document.querySelectorAll(".dia")

let html = `
<h1>Ficha de Treino</h1>
<p><b>Aluno:</b> ${nome}</p>
<p><b>Objetivo:</b> ${objetivo}</p>
`

dias.forEach((dia,index)=>{

const titulo = dia.querySelector(".titulo-dia").value
const exercicios = dia.querySelector(".exercicios").value.split("\n")
const obs = dia.querySelector(".observacao").value

html += `<div class="card">`
html += `<h2>Dia ${index+1} - ${titulo}</h2>`

if(obs){
html += `<p class="obs">${obs}</p>`
}

html += "<ul>"

exercicios.forEach(ex=>{
if(ex.trim() !== ""){
html += `<li>${ex}</li>`
}
})

html += "</ul></div>"

})

document.getElementById("ficha").innerHTML = html

}
function removerDia(botao){

const dia = botao.parentElement

dia.remove()

contadorDias--

}
function gerarPDF(){
window.print()
}

document.addEventListener("DOMContentLoaded", function(){

document
.getElementById("gerarFicha")
.addEventListener("click", gerarFicha)

document
.getElementById("adicionarDia")
.addEventListener("click", adicionarDia)

document
.getElementById("gerarPDF")
.addEventListener("click", gerarPDF)

})