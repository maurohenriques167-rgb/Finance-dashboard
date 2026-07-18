let editandoId = null;
let idParaExcluir = null;
let grafico = null;

let todasTransacoes = [];

const API = "https://finance-dashboard.onrender.com/transactions";


// ===============================
// CARREGAR DADOS
// ===============================

async function carregarDados(){

    try{


        const resposta = await fetch(API);

        const dados = await resposta.json();


        todasTransacoes = dados;

        window.transacoes = dados;



        atualizarDashboard(dados);



    }catch(error){

        console.log("Erro ao carregar:", error);

    }


}




// ===============================
// ATUALIZAR DASHBOARD
// ===============================

function atualizarDashboard(dados){



    let receitas = 0;

    let despesas = 0;



    dados.forEach(item=>{


        const valor = Number(item.amount);



        if(item.type === "receita"){

            receitas += valor;

        }else{

            despesas += valor;

        }


    });




    document.getElementById("receitas").innerHTML =

    "R$ " + receitas.toFixed(2);



    document.getElementById("despesas").innerHTML =

    "R$ " + despesas.toFixed(2);



    document.getElementById("saldo").innerHTML =

    "R$ " + (receitas - despesas).toFixed(2);




    mostrarTransacoes(dados);



    criarGrafico(
        receitas,
        despesas
    );


}







// ===============================
// MOSTRAR TRANSAÇÕES
// ===============================

function mostrarTransacoes(dados){



    const lista =
    document.getElementById("transacoes");



    lista.innerHTML = "";



    dados.forEach(item=>{



        const valor =
        Number(item.amount);



        const classe =
        item.type === "receita"
        ? "receita"
        : "despesa";



        const sinal =
        item.type === "receita"
        ? "+"
        : "-";




        lista.innerHTML += `


<li class="${classe}">


<div class="info-transacao">


<h3>
${item.description}
</h3>


<small>
    🏷️ ${item.category || "Outros"}
    <br>
    📅 ${item.date}
</small>

</div>



<strong>

${sinal} R$ ${valor.toFixed(2)}

</strong>



<div class="acoes">


<button onclick="editarTransacao(${item.id})">

✏️

</button>



<button onclick="deletarTransacao(${item.id})">

🗑️

</button>


</div>


</li>


`;



    });



}






// ===============================
// PESQUISA E FILTROS
// ===============================


function aplicarFiltros(){



    const texto =

    document.getElementById("pesquisa")
    .value
    .toLowerCase();



    const tipo =

    document.getElementById("filtroTipo")
    .value;





    const filtradas =

    todasTransacoes.filter(item=>{



        const nome =

        item.description
        .toLowerCase();



        const buscaOK =

        nome.includes(texto);



        const tipoOK =

        tipo === "todos"

        ||

        item.type === tipo;




        return buscaOK && tipoOK;



    });





    mostrarTransacoes(filtradas);



}





document
.getElementById("pesquisa")
?.addEventListener(
"input",
aplicarFiltros
);



document
.getElementById("filtroTipo")
?.addEventListener(
"change",
aplicarFiltros
);






// ===============================
// GRÁFICO
// ===============================


function criarGrafico(receitas, despesas){



    const canvas =
    document.getElementById("graficoFinanceiro");



    if(!canvas){

        return;

    }



    if(grafico){

        grafico.destroy();

    }




    const dark =

    document.body.classList.contains("dark");





    grafico = new Chart(canvas,{



        type:"doughnut",



        data:{


            labels:[

                "Receitas",

                "Despesas"

            ],



            datasets:[{


                data:[

                    receitas,

                    despesas

                ],



                backgroundColor:[

                    "#22c55e",

                    "#ef4444"

                ],



                borderWidth:0,

                hoverOffset:15


            }]



        },



        options:{


            responsive:true,



            plugins:{


                legend:{


                    position:"bottom",


                    align:"center",



                    labels:{


                        color:

                        dark
                        ?
                        "#ffffff"
                        :
                        "#000000",



                        font:{


                            size:15,

                            weight:"bold"


                        },


                        padding:20


                    }


                }


            }


        }



    });



}
// ===============================
// EXCLUIR TRANSAÇÃO
// ===============================


function deletarTransacao(id){


    idParaExcluir = id;



    document.getElementById("modalExcluir")
    .style.display = "flex";


}




function fecharModalExcluir(){


    document.getElementById("modalExcluir")
    .style.display = "none";


}






document.addEventListener("click", async (e)=>{



    if(e.target.id === "cancelarExcluir"){


        fecharModalExcluir();


    }





    if(e.target.id === "confirmarExcluir"){



        await fetch(`${API}/${idParaExcluir}`,{


            method:"DELETE"


        });



        fecharModalExcluir();



        carregarDados();



    }



});







// ===============================
// EDITAR TRANSAÇÃO
// ===============================


function editarTransacao(id){



    const transacao =

    todasTransacoes.find(
        item => item.id === id
    );



    if(!transacao){

        return;

    }





    document.getElementById("descricao").value =

    transacao.description;




    document.getElementById("valor").value =

    transacao.amount;




    document.getElementById("tipo").value =

    transacao.type;




    document.getElementById("data").value =

    transacao.date;





    editandoId = id;




    document.getElementById("botaoSalvar").innerHTML =

    "Salvar edição";



}









// ===============================
// FORMULÁRIO
// ===============================


const formulario =

document.querySelector("form");




formulario.addEventListener("submit", async(e)=>{



    e.preventDefault();





   const dados = {

    description:
    document.getElementById("descricao").value,


    amount:
    document.getElementById("valor").value,


    type:
    document.getElementById("tipo").value,


    date:
    document.getElementById("data").value,


    category:
document.querySelector("#categoria").value

};
console.log(
    "Categoria escolhida:",
    document.querySelector("#categoria").value
);
console.log(dados);






    if(editandoId){



        await fetch(`${API}/${editandoId}`,{


            method:"PUT",



            headers:{


                "Content-Type":"application/json"


            },



            body:JSON.stringify(dados)



        });





        editandoId = null;





        document.getElementById("botaoSalvar").innerHTML =

        "Adicionar";





    }else{



        await fetch(API,{



            method:"POST",



            headers:{


                "Content-Type":"application/json"


            },



            body:JSON.stringify(dados)



        });



    }







    formulario.reset();



    carregarDados();





});









// ===============================
// TEMA ESCURO
// ===============================


const temaBtn =

document.getElementById("temaBtn");






function atualizarGraficoTema(){


    carregarDados();


}







if(temaBtn){



    temaBtn.onclick = function(){





        document.body.classList.toggle("dark");






        if(document.body.classList.contains("dark")){



            temaBtn.innerHTML = "☀️";



            localStorage.setItem(
                "tema",
                "dark"
            );



        }else{



            temaBtn.innerHTML = "🌙";



            localStorage.setItem(
                "tema",
                "light"
            );



        }






        atualizarGraficoTema();




    };



}









// ===============================
// MANTER TEMA SALVO
// ===============================


if(localStorage.getItem("tema") === "dark"){



    document.body.classList.add("dark");



    if(temaBtn){


        temaBtn.innerHTML = "☀️";


    }


}








// ===============================
// INICIAR
// ===============================


carregarDados();