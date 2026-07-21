// Módulo 3/7 — Renderiza a lista de transações na tela e os filtros (mês, categoria, tipo).
// Depende dos módulos 00 e 01 (usa todasTransacoes).

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

                    ${escapeHtml(item.description)}

                </h3>



                <small>


                    🏷️ ${escapeHtml(item.category || "Outros")}


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







