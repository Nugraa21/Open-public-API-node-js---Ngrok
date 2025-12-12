const helmet = require("helmet");

module.exports = function (app) {
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false
    }));
};
