const bodyPaser = require('body-parser');
const cors = require('cors');

module.exports = app => {
    /* Configuração dos middlewares  e cors para receber requisições */
    app.use(bodyPaser.json());
    app.use(cors());
}