// Módulo 2/7 — Busca as transações na API e alimenta dashboard, resumo mensal, XP e regra 70/20/10.
// Depende do módulo 00 (getToken, API).

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

            return;

        }



        todasTransacoes = dados;



        atualizarDashboard(dados);



    }catch(error){


        console.error(
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
