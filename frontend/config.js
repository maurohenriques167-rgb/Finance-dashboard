// ==========================================
// CONFIGURAÇÃO GLOBAL
// ==========================================
// URL da API usada por script.js, login.js e cadastro.js.
// Antes essa mesma linha estava duplicada em 3 arquivos —
// agora existe em um lugar só. Para trocar de backend
// (ex: rodar local), basta mudar aqui.

const API = "https://finance-dashboard-qr30.onrender.com";

// ==========================================
// SEGURANÇA
// ==========================================
// Escapa caracteres especiais de HTML antes de inserir texto vindo do
// usuário (nome, descrição, categoria) em innerHTML. Sem isso, alguém
// que cadastra um nome ou descrição como "<img src=x onerror=...>"
// consegue executar JavaScript no navegador de quem visualizar o dado
// (XSS armazenado). Fica em config.js porque é o primeiro script
// carregado em todas as páginas.

function escapeHtml(valor){

    if(valor === null || valor === undefined){
        return "";
    }

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}
