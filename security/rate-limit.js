const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 150, // limit request
    message: {
        status: 429,
        error: "Terlalu banyak request, coba lagi nanti."
    }
});
