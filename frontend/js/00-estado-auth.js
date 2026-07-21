// Módulo 1/7 — Estado global, verificação de login, token, dados do usuário e logout.
// Precisa carregar ANTES de todos os outros (define variáveis usadas em todo o resto).

// ==========================================
// CONFIGURAÇÃO
// ==========================================


let todasTransacoes = [];

let editandoId = null;

let idParaExcluir = null;

let grafico = null;



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

        nome.innerHTML = escapeHtml(usuarioLogado.name);

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
