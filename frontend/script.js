// ==========================================
// CONFIGURAÇÃO
// ==========================================


let todasTransacoes = [];

let editandoId = null;

let idParaExcluir = null;

let grafico = null;


const API = "https://finance-dashboard-qr30.onrender.com";



// ==========================================
// VERIFICAR LOGIN
// ==========================================


if(!localStorage.getItem("token")){

    window.location.href = "login.html";

}




// ==========================================
// TOKEN
// ==========================================


function getToken(){

    return localStorage.getItem("token");

}



// ==========================================
// USUÁRIO LOGADO
// ==========================================


const usuarioLogado = JSON.parse(

    localStorage.getItem("usuario")

);



if(usuarioLogado){


    const nome = document.getElementById(
        "nomeUsuario"
    );


    if(nome){

        nome.innerHTML = usuarioLogado.name;

    }


}




// ==========================================
// LOGOUT
// ==========================================


const logoutBtn = document.getElementById(
    "logoutBtn"
);



if(logoutBtn){


    logoutBtn.onclick = ()=>{


        localStorage.removeItem("token");

        localStorage.removeItem("usuario");


        window.location.href =
        "login.html";


    };


}
// ==========================================
// CARREGAR TRANSAÇÕES
// ==========================================


async function carregarDados(){


    try{


        const resposta = await fetch(

            `${API}/transactions`,

            {

                headers:{


                    "Authorization":
                    `Bearer ${getToken()}`


                }

            }

        );



        const dados = await resposta.json();



        if(!resposta.ok){

            console.log(dados);

            return;

        }



        todasTransacoes = dados;



        atualizarDashboard(dados);



    }catch(error){


        console.log(
            "Erro ao carregar dados:",
            error
        );


    }


}






// ==========================================
// ATUALIZAR DASHBOARD
// ==========================================


function atualizarDashboard(dados){



    let receitas = 0;

    let despesas = 0;



    dados.forEach(item=>{


        const valor = Number(
            item.amount
        );



        if(item.type === "receita"){


            receitas += valor;


        }else{


            despesas += valor;


        }



    });





    const saldo =
    receitas - despesas;





    document.getElementById(
        "saldo"
    ).innerHTML =
    "R$ " + saldo.toFixed(2);





    document.getElementById(
        "receitas"
    ).innerHTML =
    "R$ " + receitas.toFixed(2);





    document.getElementById(
        "despesas"
    ).innerHTML =
    "R$ " + despesas.toFixed(2);





    atualizarResumo(
        dados,
        receitas,
        despesas
    );



    atualizarXP(
        saldo,
        receitas,
        despesas
    );



    atualizarRegra(
        despesas
    );



    mostrarTransacoes(
        dados
    );



    criarGrafico(
        receitas,
        despesas
    );


}







// ==========================================
// RESUMO MENSAL
// ==========================================


function atualizarResumo(
    dados,
    receitas,
    despesas
){



    const economizado =
    receitas - despesas;



    document.getElementById(
        "economizado"
    ).innerHTML =

    "R$ " + economizado.toFixed(2);





    let maiorReceita = 0;

    let maiorDespesa = 0;



    dados.forEach(item=>{


        const valor =
        Number(item.amount);



        if(item.type === "receita"){


            if(valor > maiorReceita){

                maiorReceita = valor;

            }


        }else{


            if(valor > maiorDespesa){

                maiorDespesa = valor;

            }


        }


    });





    document.getElementById(
        "maiorReceita"
    ).innerHTML =

    "R$ " + maiorReceita.toFixed(2);





    document.getElementById(
        "maiorDespesa"
    ).innerHTML =

    "R$ " + maiorDespesa.toFixed(2);





    document.getElementById(
        "totalTransacoes"
    ).innerHTML =

    dados.length;



}







// ==========================================
// SISTEMA XP
// ==========================================


function atualizarXP(
    saldo,
    receitas,
    despesas
){



    let xp = 0;



    if(receitas > despesas){

        xp += 100;

    }



    if(saldo > 1000){

        xp += 100;

    }



    if(receitas > 0){

        xp += 50;

    }





    document.getElementById(
        "xp"
    ).innerHTML = xp;





    const barra =
    document.getElementById(
        "xpBarra"
    );



    if(barra){


        barra.style.width =
        Math.min(
            xp,
            100
        ) + "%";


    }



}







// ==========================================
// REGRA 70/20/10
// ==========================================


function atualizarRegra(
    despesas
){


    if(despesas === 0){

        return;

    }




    const fixos =
    Math.min(
        (despesas * 0.7),
        despesas
    );



    const lazer =
    despesas * 0.2;



    const investimento =
    despesas * 0.1;





    const p70 =
    (fixos/despesas)*100;



    const p20 =
    (lazer/despesas)*100;



    const p10 =
    (investimento/despesas)*100;





    document.getElementById(
        "valor70"
    ).innerHTML =
    p70.toFixed(0)+"%";



    document.getElementById(
        "valor20"
    ).innerHTML =
    p20.toFixed(0)+"%";



    document.getElementById(
        "valor10"
    ).innerHTML =
    p10.toFixed(0)+"%";





    document.getElementById(
        "barra70"
    ).style.width =
    p70+"%";



    document.getElementById(
        "barra20"
    ).style.width =
    p20+"%";



    document.getElementById(
        "barra10"
    ).style.width =
    p10+"%";



}
// ==========================================
// MOSTRAR TRANSAÇÕES
// ==========================================


function mostrarTransacoes(dados){


    const lista =
    document.getElementById(
        "transacoes"
    );


    if(!lista){

        return;

    }



    lista.innerHTML = "";



    if(dados.length === 0){


        lista.innerHTML = `

        <li>

            Nenhuma transação encontrada.

        </li>

        `;


        return;

    }





    dados.forEach(item=>{


        const valor =
        Number(item.amount);



        const classe =
        item.type === "receita"
        ?
        "receita"
        :
        "despesa";



        const sinal =
        item.type === "receita"
        ?
        "+"
        :
        "-";





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


                ${sinal}

                R$ ${valor.toFixed(2)}


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








// ==========================================
// FILTROS
// ==========================================


function aplicarFiltros(){



    const pesquisa =
    document.getElementById(
        "pesquisa"
    )
    .value
    .toLowerCase();





    const tipo =
    document.getElementById(
        "filtroTipo"
    )
    .value;





    const categoria =
    document.getElementById(
        "filtroCategoria"
    )
    .value;





    const mes =
    document.getElementById(
        "filtroMesHistorico"
    )
    .value;






    const filtradas =

    todasTransacoes.filter(item=>{



        const descricao =

        item.description

        .toLowerCase();





        const buscaOK =

        descricao.includes(
            pesquisa
        );







        const tipoOK =

        tipo === "todos"

        ||

        item.type === tipo;







        const categoriaOK =


        categoria === "todos"

        ||

        item.category === categoria;







        let mesOK = true;



        if(mes !== "todos"){


            const data =
            new Date(item.date);



            mesOK =

            (data.getMonth()+1)

            ==

            mes;



        }







        return (

            buscaOK

            &&

            tipoOK

            &&

            categoriaOK

            &&

            mesOK

        );



    });





    mostrarTransacoes(
        filtradas
    );



}







// EVENTOS DOS FILTROS


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



document
.getElementById("filtroCategoria")
?.addEventListener(
    "change",
    aplicarFiltros
);



document
.getElementById("filtroMesHistorico")
?.addEventListener(
    "change",
    aplicarFiltros
);









// ==========================================
// PREENCHER FILTRO DE MESES
// ==========================================


function carregarMeses(){



    const select =

    document.getElementById(
        "filtroMesHistorico"
    );



    if(!select){

        return;

    }



    const meses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];





    meses.forEach((mes,index)=>{



        select.innerHTML += `

        <option value="${index+1}">

        ${mes}

        </option>

        `;


    });



}







// ==========================================
// GRÁFICO DE BARRAS
// ==========================================
function criarGrafico(
    receitas,
    despesas
){

    const canvas = document.getElementById(
        "graficoFinanceiro"
    );


    if(!canvas){

        return;

    }



    if(grafico){

        grafico.destroy();

    }



    const saldo = receitas - despesas;


    let prejuizo = 0;


    if(saldo < 0){

        prejuizo = Math.abs(saldo);

    }



    const dark =
    document.body.classList.contains(
        "dark"
    );




    grafico = new Chart(

        canvas,

        {

            type:"bar",


            data:{


                labels:[

                    "Receitas",
                    "Despesas",
                    "Prejuízo"

                ],



                datasets:[

{
    label:"Receita",

    data:[receitas, null, null],

    backgroundColor:"#16a34a",

    borderRadius:{
        topLeft:10,
        topRight:10
    },

    barPercentage:0.6,

    categoryPercentage:0.8

},


{
    label:"Despesa",

    data:[null, despesas, null],

    backgroundColor:"#2563eb",

    borderRadius:{
        topLeft:10,
        topRight:10
    },

    barPercentage:0.6,

    categoryPercentage:0.8

},


{
    label:"Prejuízo",

    data:[null, null, prejuizo],

    backgroundColor:"#dc2626",

    borderRadius:{
        topLeft:10,
        topRight:10
    },

    barPercentage:0.6,

    categoryPercentage:0.8

}

]


            },



            options:{


    responsive:true,


    maintainAspectRatio:false,


    interaction:{


        mode:"index",


        intersect:false


    },



    plugins:{


        legend:{


            position:"bottom",


            labels:{


                color:

                dark

                ?

                "#fff"

                :

                "#222",


                padding:25,


                font:{


                    size:15


                }


            }


        }



    },



    scales:{



        x:{


            stacked:true,


            grid:{


                display:false


            },


            ticks:{


                color:

                dark

                ?

                "#fff"

                :

                "#222",


                font:{


                    size:14


                }


            }



        },




        y:{


            stacked:true,


            beginAtZero:true,


            ticks:{


                color:

                dark

                ?

                "#fff"

                :

                "#222"


            }


        }



    },



    datasets:{


        bar:{


            categoryPercentage:0.8,


            barPercentage:0.6



        }


    }



}



        }


    );


}
// ==========================================
// ABRIR MODAL RECEITA
// ==========================================


const btnReceita =
document.getElementById(
    "btnReceita"
);



const modalReceita =
document.getElementById(
    "modalReceita"
);



if(btnReceita){


    btnReceita.onclick = ()=>{


        modalReceita.style.display =
        "flex";


    };


}






// ==========================================
// ABRIR MODAL DESPESA
// ==========================================


const btnDespesa =
document.getElementById(
    "btnDespesa"
);



const modalDespesa =
document.getElementById(
    "modalDespesa"
);



if(btnDespesa){


    btnDespesa.onclick = ()=>{


        modalDespesa.style.display =
        "flex";


    };


}







// ==========================================
// FECHAR MODAIS
// ==========================================


document
.getElementById("fecharReceita")
?.addEventListener(
"click",
()=>{


    modalReceita.style.display =
    "none";


});





document
.getElementById("fecharDespesa")
?.addEventListener(
"click",
()=>{


    modalDespesa.style.display =
    "none";


});









document
.getElementById("fecharEditar")
?.addEventListener(
"click",
()=>{


    document.getElementById(
        "modalEditar"
    ).style.display =
    "none";


});









// ==========================================
// CRIAR RECEITA
// ==========================================


document
.getElementById("formReceita")
?.addEventListener(

"submit",

async(e)=>{


    e.preventDefault();





    const dados = {


        description:

        document.getElementById(
            "descricaoReceita"
        ).value,



        amount:

        document.getElementById(
            "valorReceita"
        ).value,



        type:"receita",



        category:

        document.getElementById(
            "categoriaReceita"
        ).value,



        date:

        document.getElementById(
            "dataReceita"
        ).value


    };





    await salvarTransacao(
        dados
    );




    modalReceita.style.display =
    "none";



    e.target.reset();


}

);









// ==========================================
// CRIAR DESPESA
// ==========================================


document
.getElementById("formDespesa")
?.addEventListener(

"submit",

async(e)=>{


    e.preventDefault();





    const dados = {



        description:

        document.getElementById(
            "descricaoDespesa"
        ).value,





        amount:

        document.getElementById(
            "valorDespesa"
        ).value,





        type:"despesa",





        category:

        document.getElementById(
            "categoriaDespesa"
        ).value,





        date:

        document.getElementById(
            "dataDespesa"
        ).value



    };






    await salvarTransacao(
        dados
    );





    modalDespesa.style.display =
    "none";




    e.target.reset();



}

);









// ==========================================
// FUNÇÃO SALVAR TRANSAÇÃO
// POST
// ==========================================


async function salvarTransacao(
    dados
){


    try{


        const resposta = await fetch(

            `${API}/transactions`,

            {


                method:"POST",



                headers:{


                    "Content-Type":
                    "application/json",



                    "Authorization":
                    `Bearer ${getToken()}`


                },



                body:

                JSON.stringify(dados)



            }


        );





        const resultado =
        await resposta.json();





        console.log(
            resultado
        );





        carregarDados();





    }catch(error){


        console.log(
            "Erro ao salvar:",
            error
        );


    }



}









// ==========================================
// EDITAR TRANSAÇÃO
// ==========================================


function editarTransacao(id){



    const transacao =

    todasTransacoes.find(

        item=>item.id == id

    );





    if(!transacao){

        return;

    }






    document.getElementById(
        "editarId"
    ).value = transacao.id;





    document.getElementById(
        "editarDescricao"
    ).value = transacao.description;





    document.getElementById(
        "editarValor"
    ).value = transacao.amount;





    document.getElementById(
        "editarCategoria"
    ).value =

    transacao.category || "Outros";





    editandoId = transacao.id;





    document.getElementById(
        "modalEditar"
    ).style.display =

    "flex";



}









// ==========================================
// SALVAR EDIÇÃO
// ==========================================


document
.getElementById("formEditar")
?.addEventListener(

"submit",

async(e)=>{


    e.preventDefault();





    const dados = {



        description:

        document.getElementById(
            "editarDescricao"
        ).value,





        amount:

        document.getElementById(
            "editarValor"
        ).value,





        category:

        document.getElementById(
            "editarCategoria"
        ).value



    };






    try{



        await fetch(

            `${API}/transactions/${editandoId}`,

            {


                method:"PUT",




                headers:{



                    "Content-Type":
                    "application/json",



                    "Authorization":
                    `Bearer ${getToken()}`



                },



                body:

                JSON.stringify(dados)



            }


        );






        editandoId = null;





        document.getElementById(
            "modalEditar"
        ).style.display =

        "none";





        carregarDados();






    }catch(error){



        console.log(
            "Erro ao editar:",
            error
        );


    }



}

);









// ==========================================
// EXCLUIR TRANSAÇÃO
// ==========================================


function deletarTransacao(id){



    idParaExcluir = id;




    document.getElementById(
        "modalExcluir"
    ).style.display =

    "flex";



}








document
.getElementById("cancelarExcluir")
?.addEventListener(

"click",

()=>{


    document.getElementById(
        "modalExcluir"
    ).style.display =

    "none";


}

);









document
.getElementById("confirmarExcluir")
?.addEventListener(

"click",

async()=>{


    try{



        await fetch(

            `${API}/transactions/${idParaExcluir}`,

            {



                method:"DELETE",




                headers:{



                    "Authorization":
                    `Bearer ${getToken()}`



                }



            }


        );






        document.getElementById(
            "modalExcluir"
        ).style.display =

        "none";






        carregarDados();





    }catch(error){


        console.log(
            "Erro ao excluir:",
            error
        );


    }



}

);
// ==========================================
// TEMA ESCURO
// ==========================================


const temaBtn = 
document.getElementById(
    "temaBtn"
);





function aplicarTema(){



    const temaSalvo =

    localStorage.getItem(
        "tema"
    );



    if(temaSalvo === "dark"){



        document.body.classList.add(
            "dark"
        );



        if(temaBtn){

            temaBtn.innerHTML =
            "☀️";

        }



    }



}







if(temaBtn){



    temaBtn.onclick = ()=>{





        document.body.classList.toggle(
            "dark"
        );






        const dark =

        document.body.classList.contains(
            "dark"
        );






        if(dark){



            localStorage.setItem(
                "tema",
                "dark"
            );



            temaBtn.innerHTML =
            "☀️";



        }else{



            localStorage.setItem(
                "tema",
                "light"
            );



            temaBtn.innerHTML =
            "🌙";



        }





        carregarDados();




    };



}








// ==========================================
// MODAL REGRA 70/20/10
// ==========================================


const btnExplicarRegra =

document.getElementById(
    "btnExplicarRegra"
);



const modalRegra =

document.getElementById(
    "modalRegra"
);





if(btnExplicarRegra){


    btnExplicarRegra.onclick = ()=>{


        modalRegra.style.display =
        "flex";


    };


}






document
.getElementById("fecharRegra")
?.addEventListener(

"click",

()=>{


    modalRegra.style.display =
    "none";


}

);









// ==========================================
// BOTÃO AJUDA
// ==========================================


const btnAjuda =

document.getElementById(
    "btnAjuda"
);




if(btnAjuda){



    btnAjuda.onclick = ()=>{



        modalRegra.style.display =
        "flex";



    };


}









// ==========================================
// BOTÃO METAS
// ==========================================


const btnMetas =

document.getElementById(
    "btnMetas"
);





if(btnMetas){



    btnMetas.onclick = ()=>{


        document
        .getElementById(
            "metas"
        )
        .scrollIntoView({

            behavior:"smooth"

        });



    };


}








// ==========================================
// NOVA META
// ==========================================


const novaMeta =

document.getElementById(
    "novaMeta"
);




if(novaMeta){



    novaMeta.onclick = ()=>{


        alert(
        "Sistema de metas em desenvolvimento!"
        );


    };


}








// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================


window.onclick = (e)=>{


    const modais = document.querySelectorAll(
        ".modal, .modal-transacao"
    );



    modais.forEach(modal=>{


        if(e.target === modal){


            modal.style.display =
            "none";


        }



    });



};









// ==========================================
// FORMATAR DATAS PADRÃO
// ==========================================


function colocarDataAtual(){



    const hoje =

    new Date()
    .toISOString()
    .split("T")[0];





    const campos = [


        "dataReceita",

        "dataDespesa"



    ];





    campos.forEach(id=>{


        const campo =
        document.getElementById(id);



        if(campo && !campo.value){


            campo.value =
            hoje;


        }



    });



}









// ==========================================
// INICIAR SISTEMA
// ==========================================



aplicarTema();


carregarMeses();


colocarDataAtual();


carregarDados();    