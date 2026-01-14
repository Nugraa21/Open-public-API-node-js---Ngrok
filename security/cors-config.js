const cors = require("cors");

module.exports = cors({
    origin: [
        "http://localhost:3000",
        "https://nugra.online",
        "https://your-domain.com"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
