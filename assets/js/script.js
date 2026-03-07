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

<button class="remover-dia" onclick="removerDia(this)">
❌ Remover dia</button>
`

container.appendChild(bloco)

}

function gerarFicha(){

const nome = document.getElementById("nome").value

if (nome.trim() === ""){
alert("Por favor, preencha o nome do aluno")
return
}

const objetivo = document.getElementById("objetivo").value

if (objetivo.trim() === ""){
alert("Por favor, preencha o objetivo do aluno")
return
}


const dias = document.querySelectorAll(".dia")

if(dias.length === 0){
alert("Adicione pelo menos um dia de treino")
return
}

let html = `
<h1>Ficha de Treino</h1>
<p><b>Aluno:</b> ${nome}</p>
<p><b>Objetivo:</b> ${objetivo}</p>
`

dias.forEach((dia,index)=>{

const titulo = dia.querySelector(".titulo-dia").value
const exercicios = dia.querySelector(".exercicios").value
const obs = dia.querySelector(".observacao").value

const lista = exercicios.split("\n")
const filtrados = lista.filter(ex => ex.trim() !== "")
const itens = filtrados.map(ex => `<li>${ex}</li>`)
const htmlExercicios = `<ul>${itens.join("")}</ul>`

html += `
<div class="card">
<h2>Dia ${index+1} - ${titulo}</h2>
${htmlExercicios}
`

if(obs.trim() !== ""){
html += `<p class="obs">${obs}</p>`
}

html += `</div>`

})

document.getElementById("ficha").innerHTML = html

}

function gerarPDF(){
window.print()
}

function attNunDias(){

const dias = document.querySelectorAll(".dia")
dias.forEach((dia,index)=>{
const titulo = dia.querySelector("h3")
titulo.textContent = `Dia ${index+1}`
})

contadorDias = dias.length

}


function removerDia(botao){

const confirmar = confirm("Tem certeza que deseja remover este dia?")

if(confirmar){
botao.parentElement.remove()

attNunDias()
 
}

}

function limparFormulario(){
    const confirmar = confirm("Tem certeza que deseja limpar o formulário?")

    if(!confirmar) return
  
    document.getElementById("nome").value = ""
    document.getElementById("objetivo").value = ""

    
    document.getElementById("dias-container").innerHTML = ""
    
    
    document.getElementById("ficha").innerHTML = ""

    contadorDias = 0


}

function salvarDados(){

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


function carregarDados(){
const nome = localStorage.getItem("nome")
const objetivo = localStorage.getItem("objetivo")

if(nome){
     document.getElementById("nome").value = nome
}
if(objetivo){
     document.getElementById("objetivo").value = objetivo
}

}

document.addEventListener("DOMContentLoaded", function(){

carregarDados()

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