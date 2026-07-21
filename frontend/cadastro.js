const formulario = document.getElementById("cadastroForm");



if(formulario){


formulario.addEventListener("submit", async(e)=>{


    e.preventDefault();



    const senha =
document.getElementById("password").value;


const confirmarSenha =
document.getElementById("confirmPassword").value;



if(senha !== confirmarSenha){


    document.getElementById("mensagem").style.color = "red";


    document.getElementById("mensagem").textContent =
    "As senhas não coincidem";


    return;

}



const dados = {


    name:
    document.getElementById("name").value,


    email:
    document.getElementById("email").value,


    password: senha


};



    try{


        const resposta = await fetch(

            `${API}/users/register`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(dados)

            }

        );



        const resultado = await resposta.json();



        const mensagem =
        document.getElementById("mensagem");



        if(resposta.ok){


            mensagem.style.color="green";


            mensagem.textContent =
            "Cadastro realizado! Indo para login...";



            setTimeout(()=>{


                window.location.href="login.html";


            },1500);



        }else{


            mensagem.style.color="red";


            mensagem.textContent =
            resultado.erro || "Erro ao cadastrar";


        }



    }catch(error){


        console.error("Erro ao cadastrar:", error);


        document.getElementById("mensagem").textContent =
        "Erro de conexão";


    }


});


}