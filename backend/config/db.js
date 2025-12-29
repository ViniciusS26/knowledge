const config = require('../knexfile');

const knex = require('knex')(config);

knex.migrate.latest([config])
    .then(() => {
        console.log('Banco de dados migrado');
    })
    .catch((error) => {
        console.error('Erro ao migrar o banco de dados:', error);
    });

module.exports = knex;