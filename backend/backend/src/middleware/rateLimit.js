// Rate limiter simples em memória, sem dependências externas.
// Bloqueia excesso de tentativas por IP em uma janela de tempo.
// OBS: em produção com múltiplas instâncias, prefira uma solução
// baseada em Redis (ex: rate-limiter-flexible) para compartilhar o estado.

function criarRateLimiter({ janelaMs = 15 * 60 * 1000, maxTentativas = 10 } = {}) {

    const tentativasPorIp = new Map();

    return function rateLimit(req, res, next) {

        const ip = req.ip;
        const agora = Date.now();

        const registro = tentativasPorIp.get(ip);

        if (!registro || agora - registro.inicio > janelaMs) {
            tentativasPorIp.set(ip, { inicio: agora, contagem: 1 });
            return next();
        }

        if (registro.contagem >= maxTentativas) {
            return res.status(429).json({
                erro: "Muitas tentativas. Tente novamente em alguns minutos."
            });
        }

        registro.contagem += 1;
        next();

    };

}

module.exports = criarRateLimiter;
