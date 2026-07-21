// Módulo 4/7 — Gráfico de barras (Chart.js) de receitas x despesas x prejuízo.
// Depende do Chart.js (carregado via CDN no HTML) e do módulo 00.

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
