const formulario = document.getElementById("loginForm");


formulario.addEventListener("submit", async(e)=>{


    e.preventDefault();



    const dados = {

        email:
        document.getElementById("email").value,


        password:
        document.getElementById("password").value

    };



    try{


        const resposta = await fetch(

            `${API}/users/login`,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },


                body:

                JSON.stringify(dados)


            }

        );



        const resultado = await resposta.json();



        if(resposta.ok){



            localStorage.setItem(

                "token",

                resultado.token

            );



            localStorage.setItem(

                "usuario",

                JSON.stringify(resultado.usuario)

            );



            window.location.href="dashboard.html";



        }else{


            document.getElementById("mensagem").innerHTML =

            resultado.erro;


        }



    }catch(error){


        console.error("Erro ao fazer login:", error);

        document.getElementById("mensagem").innerHTML =
        "Não foi possível conectar ao servidor. Tente novamente.";


    }


});
