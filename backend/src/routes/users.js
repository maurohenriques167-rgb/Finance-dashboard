const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const criarRateLimiter = require("../middleware/rateLimit");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limite mais rígido para rotas sensíveis (login/cadastro): 10 tentativas a cada 15 min por IP
const limiteAuth = criarRateLimiter({ janelaMs: 15 * 60 * 1000, maxTentativas: 10 });


router.get("/", (req, res) => {
    res.send("Rota de usuários funcionando");
});


// CADASTRAR USUÁRIO
router.post("/register", limiteAuth, async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ erro: "Nome é obrigatório" });
        }

        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ erro: "Email inválido" });
        }

        if (!password || typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ erro: "Senha deve ter pelo menos 6 caracteres" });
        }

        const existe = await User.findOne({
            where: { email }
        });

        if (existe) {
            return res.status(400).json({
                erro: "Email já cadastrado"
            });
        }

        const senhaHash = await bcrypt.hash(password, 10);

        const usuario = await User.create({
            name: name.trim(),
            email,
            password: senhaHash
        });

        res.status(201).json({

            mensagem: "Usuário criado com sucesso",
            usuario: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email
            }

        });

    } catch (error) {

        console.error("Erro ao cadastrar usuário:", error);

        res.status(500).json({
            erro: "Erro ao cadastrar"
        });

    }

});


// LOGIN
router.post("/login", limiteAuth, async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });
        }

        const usuario = await User.findOne({
            where: { email }
        });

        // Mesma mensagem genérica para "não existe" e "senha errada":
        // evita que um atacante descubra quais emails estão cadastrados.
        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });
        }

        const senhaCorreta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({

            token,

            usuario: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email
            }

        });

    } catch (error) {

        console.error("Erro no login:", error);

        res.status(500).json({
            erro: "Erro no login"
        });

    }

});


module.exports = router;
