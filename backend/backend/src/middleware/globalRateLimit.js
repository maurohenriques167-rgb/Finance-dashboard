const rateLimit = require("express-rate-limit");

const globalRateLimit = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        erro: "Muitas requisições. Tente novamente em alguns minutos."
    }

});

module.exports = globalRateLimit;