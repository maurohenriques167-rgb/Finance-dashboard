// Módulo 5/7 — Modais e formulários de criar/editar/excluir transação.
// Depende dos módulos 00 e 01 (chama carregarDados() após salvar).

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










        carregarDados();





    }catch(error){


        console.error(
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



        console.error(
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


        console.error(
            "Erro ao excluir:",
            error
        );


    }



}

);
