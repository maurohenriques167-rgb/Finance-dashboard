// Módulo 6/7 — Tema escuro, modais auxiliares (ajuda, metas, regra 70/20/10) e formatação de datas.
// Depende do módulo 00.

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









